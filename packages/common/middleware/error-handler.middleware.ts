import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/custom.error";
import { getLogger } from "@mta/logger";
import { ApiResponse } from "../utils/reponse.util";
import { ZodErrorHandler } from "../utils/zod.error";

const logger = getLogger("@mta/common/error", "debug");

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    logger.warn(
      `Skipping error response for ${req.originalUrl} - Headers already sent.`
    );
    return next(err);
  }

  logger.error(`Error occurred: ${err.message}`, {
    name: err.name,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
  });

  // Handle custom AppError
  if (err instanceof AppError) {
    return ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      err.code,
      err.details
    );
  }

  if (ZodErrorHandler.isZodError(err)) {
    const formattedErrors = ZodErrorHandler.formatZodError(err);
    const message = ZodErrorHandler.getErrorMessage(err);

    return ApiResponse.validationError(res, message, formattedErrors);
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaError = err as any;

    switch (prismaError.code) {
      case "P2002":
        return ApiResponse.conflict(
          res,
          `A record with this ${
            prismaError.meta?.target?.[0] || "field"
          } already exists`
        );
      case "P2025":
        return ApiResponse.notFound(res, "Record not found");
      case "P2003":
        return ApiResponse.badRequest(res, "Foreign key constraint failed");
      default:
        return ApiResponse.serverError(res, "Database error occurred");
    }
  }

  // Handle MongoDB duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern || {})[0];
    return ApiResponse.conflict(
      res,
      `A record with this ${field} already exists`
    );
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return ApiResponse.unauthorized(res, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return ApiResponse.unauthorized(res, "Token expired");
  }

  // Handle validation errors (e.g., from express-validator)
  if (err.name === "ValidationError") {
    return ApiResponse.validationError(
      res,
      "Validation failed",
      (err as any).errors
    );
  }

  // Default to 500 server error
  return ApiResponse.serverError(
    res,
    "An unexpected error occurred",
    process.env.NODE_ENV === "development" ? err : undefined
  );
};
