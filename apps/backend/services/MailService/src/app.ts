import dotenv from "dotenv";
dotenv.config();

import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { ApiResponse, errorHandler, requestLogger } from "@mta/common";
import helmet from "helmet";
import { logger } from "./config/logger";
import { eventBus, notificationConsumer } from "./events/kafka";
import { EmailService } from "./services/mail.service";

class NotificationService {
  private app: Application;
  private PORT: string;
  private email: EmailService;
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || "3004";
    this.email = new EmailService();

    this.initilizeMiddlewares();
    this.setUpRoutes();
    this.setUpErrorHandlers();
  }

  private initilizeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(errorHandler);
    this.app.use(requestLogger);
  }

  private setUpRoutes() {
    this.app.get("/", (req: Request, res: Response) => {
      ApiResponse.success(
        res,
        {
          status: "ok",
          timestamp: new Date().toISOString(),
          service: "Notification Service",
        },
        "Notification Service is Healthy"
      );
    });

    // health check
    this.app.get("/health", (req: Request, res: Response) => {
      ApiResponse.success(
        res,
        {
          status: "ok",
          timestamp: new Date().toISOString(),
          service: "Notification Service",
        },
        "Notification Service is Healthy"
      );
    });
  }

  private setUpErrorHandlers() {
    // 404
    this.app.use((req: Request, res: Response) => {
      ApiResponse.error(
        res,
        "The Requested Endpoint does not exist",
        404,
        "NOT_FOUND",
        {
          status: "error",
          timestamp: new Date().toISOString(),
          service: "Notification Service",
        }
      );
    });

    this.app.use(errorHandler);
  }

  public async start() {
    try {
      await eventBus.connect();
      await this.email.verifyConnection();
      await notificationConsumer.start();
      this.app.listen(this.PORT, () => {
        logger.info(`Notification Service is running on port ${this.PORT}`);
      });
      logger.info(`\n💚 Health check: http://localhost:${this.PORT}/health\n`);
    } catch (error) {
      logger.error(
        `Notification Service failed to start on port ${this.PORT}`,
        error
      );
      process.exit(1);
    }
  }

  public getApp(): Application {
    return this.app;
  }
}

// start the notification service
const service = new NotificationService();

service.start();
