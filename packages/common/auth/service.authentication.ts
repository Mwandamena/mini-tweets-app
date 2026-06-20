import { getLogger } from "@mta/logger";
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/reponse.util";

const logger = getLogger("Service-Authentication", "info");

export const serviceAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"] as string;
  const serviceName = req.headers["x-service-name"] as string;

  const validApiKey = process.env.INTERNAL_API_KEY;

  if (!validApiKey) {
    throw new Error("Internal API key not found");
  }

  if (!apiKey) {
    logger.warn(
      `401 Unauthorized: X-API-Key missing from ${serviceName} on ${req.method} ${req.originalUrl}`
    );
    return ApiResponse.unauthorized(
      res,
      "Authentication required for this internal endpoint."
    );
  }

  if (apiKey === validApiKey) {
    logger.info(`Internal request from: ${serviceName || "unknown"}`);
    return next();
  }

  logger.error("Unauthorized Service Request - Invalid API key", {
    apiKey,
    serviceName,
  });

  return ApiResponse.forbidden(
    res,
    `Unauthorized Service Request - Invalid API key: ${apiKey}`
  );
};
