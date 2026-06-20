import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";

import { ApiResponse, errorHandler, requestLogger } from "@mta/common";
import { logger } from "./config/logger";
import { prisma } from "./db/prisma";
import { tweetsRouter } from "./routes/tweets.routes";
import { bookmarksRouter } from "./routes/bookmark.routes";
import { hashtagRouter } from "./routes/hashtag.routes";
import { engagementRouter } from "./routes/engagement.routes";
import { mediaRouter } from "./routes/media.routes";
import cookieParser from "cookie-parser";
import { timelineRouter } from "./routes/timeline.routes";
import { eventBus, tweetConsumer } from "./events/kafka";
import {
  metricsMiddleware,
  metricsEndpoint,
  initMetrics,
  initTracing,
  metricsErrorHandler,
} from "@mta/metrics";

const PORT = process.env.PORT || 3003;
const SERVICE_NAME = process.env.SERVICE_NAME || "tweet-service";
const TEMPO_ENDPOINT =
  process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://mta-tempo:4317";

const app = express();

initMetrics(SERVICE_NAME);
initTracing(SERVICE_NAME, TEMPO_ENDPOINT);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(requestLogger);
app.use(metricsMiddleware(SERVICE_NAME));

// register all routes
app.use(tweetsRouter);
app.use(bookmarksRouter);
app.use(hashtagRouter);
app.use(engagementRouter);
app.use(mediaRouter);
app.use(timelineRouter);

// routes
app.get("/", (req: Request, res: Response) => {
  ApiResponse.success(res, null, "Welcome to the Tweets Service");
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  return ApiResponse.success(
    res,
    {
      service: "Tweet Service",
      uptime: process.uptime(),
    },
    "Tweet service is healthy"
  );
});

app.get("/metrics", metricsEndpoint);

app.use(metricsErrorHandler(SERVICE_NAME));

app.use((req: Request, res: Response) => {
  logger.warn(`Resource not found: ${req.method} ${req.url}`);
  return ApiResponse.notFound(res, "Resource not found");
});

// global error
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    prisma.$connect;
    await eventBus.connect();
    await tweetConsumer.start();
    logger.info("Tweet Database connected successfuly");
    app.listen(PORT, () => {
      logger.info(`Tweet service running on port: ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start Tweet service:", error);
    process.exit(1);
  }
};

startServer();
