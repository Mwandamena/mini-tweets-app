import express, { Application, Request, Response, NextFunction } from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import cors from "cors";
import jwt from "jsonwebtoken";
import { ApiResponse, errorHandler, UnauthorizedError } from "@mta/common";
import logger from "./logger";
import { ClientRequest, IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import helmet from "helmet";
import { limiter } from "../middlewares/rate-limiter";
import {
  metricsMiddleware,
  metricsEndpoint,
  initMetrics,
  initTracing,
  metricsErrorHandler,
} from "@mta/metrics";

// Interfaces
interface ServiceConfig {
  target: string;
  pathRewrite?: { [key: string]: string };
  changeOrigin: boolean;
  requiresAuth?: boolean;
}

interface Services {
  [key: string]: ServiceConfig;
}

interface AuthRequest extends Request {
  user?: any;
}

// Configuration Class
class GatewayConfig {
  public serviceName: string = process.env.SERVICE_NAME || "gateway";
  public tempoEndpoint: string =
    process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://mta-tempo:4317";

  public services: Services = {
    auth: {
      target: process.env.AUTH_SERVICE_URL || "http://localhost:2001",
      pathRewrite: { "^/api/v1/auth": "" },
      changeOrigin: true,
      requiresAuth: false,
    },
    users: {
      target: process.env.USER_SERVICE_URL || "http://localhost:2002",
      pathRewrite: { "^/api/v1/users": "" },
      changeOrigin: true,
      requiresAuth: false,
    },
    tweets: {
      target:
        process.env.TWEET_SERVICE_URL ||
        process.env.TWEETS_SERVICE_URL ||
        "http://localhost:2003",
      pathRewrite: { "^/api/v1/tweets": "" },
      changeOrigin: true,
      requiresAuth: false,
    },
    mail: {
      target: process.env.MAIL_SERVICE_URL || "http://localhost:2004",
      pathRewrite: { "^/api/v1/mail": "" },
      changeOrigin: true,
      requiresAuth: false,
    },
  };

  public jwtSecret: string =
    process.env.JWT_SECRET || "comeonharrywewannasaygoodnighttoyou";
  public port: number = parseInt(process.env.PORT || "2000");
}

// Authentication Middleware Class
class AuthMiddleware {
  private jwtSecret: string;

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }

  public verify = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedError("No Authorization token provided.");
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;

      const decoded = jwt.verify(token, this.jwtSecret);
      req.user = decoded;

      logger.log(`[Auth] ✓ Token verified for user:`, req.user);
      next();
    } catch (error) {
      logger.error("[Auth] ✗ Token verification failed:", error);
      // Pass error to Express error handler instead of throwing
      next(new UnauthorizedError("Invalid or expired token provided."));
    }
  };

  public optional = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next();
      return;
    }

    try {
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;

      const decoded = jwt.verify(token, this.jwtSecret);
      req.user = decoded;
      logger.info(`[Auth] ✓ Optional auth - Token verified`);
    } catch (error) {
      logger.info(
        `[Auth] ! Optional auth - Invalid token, proceeding without auth`,
      );
    }

    next();
  };
}

// Proxy Service Class
class ProxyService {
  private serviceName: string;
  private config: ServiceConfig;

  constructor(serviceName: string, config: ServiceConfig) {
    this.serviceName = serviceName;
    this.config = config;
  }

  public createProxy(): any {
    const proxyOptions: Options = {
      target: this.config.target,
      changeOrigin: this.config.changeOrigin,
      pathRewrite: this.config.pathRewrite,

      on: {
        error: (
          err: Error,
          req: IncomingMessage,
          res: ServerResponse | Socket,
        ) => {
          logger.error(`[Proxy Error] ${this.serviceName}:`, err.message);

          // Check if res is ServerResponse (not Socket)
          if ("statusCode" in res) {
            res.statusCode = 502;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                success: false,
                message: `Error connecting to ${this.serviceName} service`,
                error: {
                  code: "BAD_GATEWAY",
                  details: err.message,
                },
                meta: {
                  timestamp: new Date().toISOString(),
                  service: this.serviceName,
                },
              }),
            );
          } else {
            // If it's a Socket, just destroy it
            res.destroy();
          }
        },

        proxyReq: (
          proxyReq: ClientRequest,
          req: IncomingMessage,
          res: ServerResponse,
        ) => {
          const authReq = req as any;
          logger.info(
            `[Proxy] → ${this.serviceName}: ${req.method} ${req.url}`,
          );

          // Forward user info to microservice if authenticated
          if (authReq.user) {
            proxyReq.setHeader(
              "X-User-Id",
              authReq.user.userId || authReq.user.id || "",
            );
            proxyReq.setHeader("X-User-Email", authReq.user.email || "");
            proxyReq.setHeader("X-User-Role", authReq.user.role || "");
          }
        },

        proxyRes: (
          proxyRes: IncomingMessage,
          req: IncomingMessage,
          res: ServerResponse,
        ) => {
          logger.info(`[Proxy] ← ${this.serviceName}: ${proxyRes.statusCode}`);
        },
      },
    };

    return createProxyMiddleware(proxyOptions);
  }

  public requiresAuth(): boolean {
    return this.config.requiresAuth || false;
  }
}

// Main API Gateway Class
class ApiGateway {
  private app: Application;
  private config: GatewayConfig;
  private authMiddleware: AuthMiddleware;
  private proxyServices: Map<string, ProxyService>;

  constructor() {
    this.app = express();
    this.config = new GatewayConfig();
    this.authMiddleware = new AuthMiddleware(this.config.jwtSecret);
    this.proxyServices = new Map();

    initMetrics(this.config.serviceName);
    initTracing(this.config.serviceName, this.config.tempoEndpoint);

    this.initializeMiddlewares();
    this.initializeProxyServices();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(limiter);
    this.app.use(this.logger);

    this.app.use(metricsMiddleware(this.config.serviceName));
  }

  private logger = (req: Request, res: Response, next: NextFunction): void => {
    logger.info(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    );
    next();
  };

  private initializeProxyServices(): void {
    Object.keys(this.config.services).forEach((serviceName) => {
      const serviceConfig = this.config.services[serviceName];
      const proxyService = new ProxyService(serviceName, serviceConfig);
      this.proxyServices.set(serviceName, proxyService);
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get("/health", (req: Request, res: Response) => {
      return ApiResponse.success(
        res,
        {
          status: "ok",
          timestamp: new Date().toISOString(),
          services: Object.keys(this.config.services),
        },
        "API Gateway is healthy",
      );
    });

    // Welcome route
    this.app.get("/", (req: Request, res: Response) => {
      return ApiResponse.success(res, null, "Welcome to API Gateway");
    });

    this.app.get("/metrics", metricsEndpoint);

    // Setup proxy routes
    this.proxyServices.forEach((proxyService, serviceName) => {
      const route = `/api/v1/${serviceName}`;

      if (proxyService.requiresAuth()) {
        logger.info(`[Setup] 🔒 ${route} (requires authentication)`);
        this.app.use(
          route,
          this.authMiddleware.verify,
          proxyService.createProxy(),
        );
      } else {
        logger.info(`[Setup] 🔓 ${route} (public)`);
        this.app.use(route, proxyService.createProxy());
      }
    });
  }

  private setupErrorHandlers(): void {
    this.app.use(metricsErrorHandler(this.config.serviceName));

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      return ApiResponse.error(
        res,
        "The requested endpoint does not exist",
        404,
        "NOT_FOUND",
        {
          path: req.path,
          availableServices: Object.keys(this.config.services).map(
            (s) => `/api/v1/${s}`,
          ),
        },
      );
    });

    // Global error handler
    this.app.use(errorHandler);
  }

  public start(): void {
    try {
      this.app.listen(this.config.port, () => {
        logger.info(`\n🚀 API Gateway running on port ${this.config.port}`);
        logger.info(`\n📋 Available routes:`);

        this.proxyServices.forEach((proxyService, serviceName) => {
          const authStatus = proxyService.requiresAuth() ? "🔒" : "🔓";
          const target = this.config.services[serviceName].target;
          logger.info(`   ${authStatus} /api/v1/${serviceName} → ${target}`);
        });

        logger.info(
          `\n💚 Health check: http://localhost:${this.config.port}/health\n`,
        );
      });
    } catch (error) {
      logger.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  public getApp(): Application {
    return this.app;
  }
}

// Start the gateway
const gateway = new ApiGateway();
export default gateway;
