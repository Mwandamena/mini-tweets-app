import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response, Router } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import requestIp from "request-ip";
import { authRouter } from "./routes/auth.routes";
import logger from "./config/logger";
import { config } from "./config/app.config";

// shared imports
import { ApiResponse, requestLogger, errorHandler } from "@mta/common";
import { authConsumer, eventBus } from "./events/index";
import {
  metricsMiddleware,
  metricsEndpoint,
  initMetrics,
  initTracing,
  metricsErrorHandler,
} from "@mta/metrics";
import { prisma } from "./db/prisma";

const PORT = process.env.PORT || 3001;
const SERVICE_NAME = process.env.SERVICE_NAME || "auth-service";

const app = express();

app.use(helmet());
app.use(requestLogger);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(requestIp.mw());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

const TEMPO_ENDPOINT =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://mta-tempo:4317";

initMetrics(SERVICE_NAME);
initTracing(SERVICE_NAME, TEMPO_ENDPOINT);

app.use(metricsMiddleware(SERVICE_NAME));

app.get("/metrics", metricsEndpoint);

app.use(`/`, authRouter);

app.get(`/health`, (req: Request, res: Response) => {
  return ApiResponse.success(
    res,
    {
      service: "Auth Service",
      uptime: process.uptime(),
    },
    "Auth service is healthy",
  );
});

app.get(`/`, (req: Request, res: Response) => {
  return ApiResponse.success(res, null, "Welcome to Auth Serivice API");
});

app.use(metricsErrorHandler(SERVICE_NAME));

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn(`Resource not found: ${req.method} ${req.url}`);
  return ApiResponse.notFound(res, "Resource not found");
});

// Global Error Handler
app.use(errorHandler);

function startServer() {
  try {
    eventBus.connect();
    app.listen(PORT, () => {
      logger.info("Auth service running on port: " + PORT);
    });
    process.on("SIGTERM", async () => {
      await authConsumer.stop();
      await eventBus.disconnect();
      process.exit(0);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
