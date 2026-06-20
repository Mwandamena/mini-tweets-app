import client from "prom-client";
import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";

import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

/**
 * ------------------------------------------------------------------
 * PROMETHEUS REGISTRY
 * ------------------------------------------------------------------
 */

export const register = client.register;

/**
 * ------------------------------------------------------------------
 * INITIALIZATION
 * ------------------------------------------------------------------
 */

export const initMetrics = (serviceName: string) => {
  logger.info(`Initializing metrics for service: ${serviceName}`);

  client.collectDefaultMetrics({
    register,
    labels: {
      service: serviceName,
    },
  });
};

export function initTracing(
  serviceName: string,
  tempoEndpoint: string = "http://mta-tempo:4317",
) {
  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: serviceName,
    }),

    traceExporter: new OTLPTraceExporter({
      url: tempoEndpoint,
    }),

    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();

  logger.info(`Tracing initialized for ${serviceName}`);

  process.on("SIGTERM", () => {
    sdk
      .shutdown()
      .then(() => logger.info("Tracing terminated"))
      .catch((error) => logger.error("Error terminating tracing", error))
      .finally(() => process.exit(0));
  });

  return sdk;
}

/**
 * ------------------------------------------------------------------
 * HTTP METRICS
 * ------------------------------------------------------------------
 */

export const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["service", "method", "route", "status_code"],
});

export const requestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["service", "method", "route", "status_code"],

  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 1.5, 2, 5],
});

/**
 * ------------------------------------------------------------------
 * ERROR METRICS
 * ------------------------------------------------------------------
 */

export const serviceErrors = new client.Counter({
  name: "service_errors_total",
  help: "Total service errors",
  labelNames: ["service", "type"],
});

/**
 * ------------------------------------------------------------------
 * DATABASE METRICS
 * ------------------------------------------------------------------
 */

export const dbQueryDuration = new client.Histogram({
  name: "db_query_duration_seconds",
  help: "Database query duration in seconds",
  labelNames: ["service", "model", "action"],

  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

export const dbQueryCounter = new client.Counter({
  name: "db_queries_total",
  help: "Total database queries",
  labelNames: ["service", "model", "action"],
});

/**
 * ------------------------------------------------------------------
 * KAFKA METRICS
 * ------------------------------------------------------------------
 */

export const kafkaMessagesProduced = new client.Counter({
  name: "kafka_messages_produced_total",
  help: "Total Kafka messages produced",
  labelNames: ["service", "topic"],
});

export const kafkaMessagesConsumed = new client.Counter({
  name: "kafka_messages_consumed_total",
  help: "Total Kafka messages consumed",
  labelNames: ["service", "topic"],
});

/**
 * ------------------------------------------------------------------
 * REDIS / CONNECTION METRICS
 * ------------------------------------------------------------------
 */

export const activeConnections = new client.Gauge({
  name: "active_connections",
  help: "Current active connections",
  labelNames: ["service"],
});

/**
 * ------------------------------------------------------------------
 * REQUEST METRICS MIDDLEWARE
 * ------------------------------------------------------------------
 */

export const metricsMiddleware =
  (serviceName: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    const end = requestDuration.startTimer({
      service: serviceName,
      method: req.method,
      route: req.path,
    });

    res.on("finish", () => {
      const labels = {
        service: serviceName,
        method: req.method,
        route: req.path,
        status_code: res.statusCode.toString(),
      };

      requestCounter.inc(labels);

      end({
        status_code: res.statusCode.toString(),
      });
    });

    next();
  };

/**
 * ------------------------------------------------------------------
 * EXPRESS ERROR HANDLER METRICS
 * ------------------------------------------------------------------
 */

export const metricsErrorHandler =
  (serviceName: string) =>
  (error: Error, _req: Request, _res: Response, next: NextFunction) => {
    serviceErrors.inc({
      service: serviceName,
      type: error.name || "unknown",
    });

    next(error);
  };

/**
 * ------------------------------------------------------------------
 * PRISMA HELPERS
 * ------------------------------------------------------------------
 */

export const observeDbQuery = (
  service: string,
  model: string,
  action: string,
  durationMs: number,
) => {
  dbQueryCounter.inc({
    service,
    model,
    action,
  });

  dbQueryDuration.observe(
    {
      service,
      model,
      action,
    },
    durationMs / 1000,
  );
};

/**
 * ------------------------------------------------------------------
 * KAFKA HELPERS
 * ------------------------------------------------------------------
 */

export const trackProducedMessage = (service: string, topic: string) => {
  kafkaMessagesProduced.inc({
    service,
    topic,
  });
};

export const trackConsumedMessage = (service: string, topic: string) => {
  kafkaMessagesConsumed.inc({
    service,
    topic,
  });
};

/**
 * ------------------------------------------------------------------
 * CONNECTION HELPERS
 * ------------------------------------------------------------------
 */

export const setActiveConnections = (service: string, count: number) => {
  activeConnections.set(
    {
      service,
    },
    count,
  );
};

/**
 * ------------------------------------------------------------------
 * METRICS ENDPOINT
 * ------------------------------------------------------------------
 */

export const metricsEndpoint = async (_req: Request, res: Response) => {
  try {
    res.setHeader("Content-Type", register.contentType);

    res.send(await register.metrics());
  } catch (error) {
    logger.error("Failed to collect metrics", error);

    res.status(500).send("Failed to collect metrics");
  }
};
