import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import helmet from "helmet";
import requestIp from "request-ip";
import logger from "./config/logger";
import cors from "cors";

// shared imports
import { ApiResponse, requestLogger, errorHandler } from "@mta/common";
import { userRouter } from "./routes/user.route";
import cookieParser from "cookie-parser";
import { followRouter } from "./routes/follow.routes";
import { prisma } from "./db/prisma";
import { communityRouter } from "./routes/community.routes";
import { eventBus, userConsumer } from "./events/kafka";
import {
  metricsMiddleware,
  metricsEndpoint,
  initMetrics,
  initTracing,
  metricsErrorHandler,
} from "@mta/metrics";

const PORT = process.env.PORT || 3002;
const SERVICE_NAME = process.env.SERVICE_NAME || "user-service";
const TEMPO_ENDPOINT =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://mta-tempo:4317";

const app = express();

initMetrics(SERVICE_NAME);
initTracing(SERVICE_NAME, TEMPO_ENDPOINT);

app.use(helmet());
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-API-Key",
      "X-Service-Name",
    ],
  }),
);

app.use(cookieParser());
app.use(requestIp.mw());
app.use(requestLogger);

// metrics
app.use(metricsMiddleware(SERVICE_NAME));

app.use(userRouter);
app.use(followRouter);
app.use(communityRouter);

app.get(`/health`, (req: Request, res: Response) => {
  return ApiResponse.success(
    res,
    {
      service: "User Service",
      uptime: process.uptime(),
    },
    "User service is healthy",
  );
});

app.get(`/`, (req: Request, res: Response) => {
  return ApiResponse.success(res, null, "Welcome to User Serivice API");
});

// metrics endpoint
app.get("/metrics", metricsEndpoint);

app.use(metricsErrorHandler(SERVICE_NAME));

// 404 handler
app.use((req: Request, res: Response) => {
  logger.warn(`Resource not found: ${req.method} ${req.url}`);
  return ApiResponse.notFound(res, "Resource not found");
});

// Global Error Handler
app.use(errorHandler);

async function startServer() {
  try {
    await eventBus.connect();
    await userConsumer.start();
    prisma.$connect;
    logger.info("User service database connected");
    app.listen(PORT, () => {
      logger.info("User service running on port: " + PORT);
    });
    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received, shutting down gracefully");
      process.exit(0);
    });

    process.on("SIGINT", async () => {
      logger.info("SIGINT received, shutting down gracefully");
      process.exit(0);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
