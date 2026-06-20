// middleware/errorHandler.ts

import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "./errorHandler";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { logger } from "../config/logger";

interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
  stack?: string; // Only in development
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errors: any[] | undefined;

  // Log FULL error details to console (for debugging)
  // console.error("=== ERROR DETAILS ===");
  // console.error("Name:", err.name);
  // console.error("Message:", err.message);
  // console.error("Stack:", err.stack);
  // console.error("Path:", req.path);
  // console.error("Method:", req.method);
  // console.error("Body:", req.body);
  // console.error("====================");

  // Handle Custom AppError
  if (err instanceof AppError) {
    logger.error(`AppError: ${err.message}`);
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Zod Validation Errors
  else if (err instanceof ZodError) {
    logger.error(`Zod Error: ${err.message}`);
    statusCode = 400;
    message = "Validation failed";
    errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
  }

  // Handle Prisma Errors
  else if (err instanceof PrismaClientKnownRequestError) {
    logger.error(`Prisma Error: ${err.message}`);
    statusCode = 400;
    switch (err.code) {
      case "P2002":
        const field = (err.meta?.target as string[])?.[0] || "field";
        message = `${field} already exists`;
        break;
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;
      case "P2003":
        message = "Related record not found";
        break;
      case "P2014":
        message = "Required relation missing";
        break;
      default:
        message = "Database operation failed";
    }
  }

  // Handle Prisma Validation Errors
  else if (err instanceof PrismaClientValidationError) {
    logger.error(`Prisma Validation Error: ${err.message}`);
    statusCode = 400;
    message = "Invalid data provided";
  }

  // Handle JWT Errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Handle Multer File Upload Errors
  else if (err.name === "MulterError") {
    statusCode = 400;
    message = `File upload error: ${err.message}`;
  }

  // Handle Syntax Errors
  else if (err instanceof SyntaxError && "body" in err) {
    logger.error(`Syntax Error: ${err.message}`);
    statusCode = 400;
    message = "Invalid JSON in request body";
  }

  // Handle Type Errors
  else if (err instanceof TypeError) {
    logger.error(`Type Error: ${err.message}`);
    statusCode = 400;
    message = "Invalid data type provided";
  }

  // Handle MongoDB Cast Errors
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Build error response (NO stack trace in response)
  const errorResponse: ErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };

  // Only include stack in development mode if you really want it
  // (Generally not recommended even in dev)
  if (
    process.env.NODE_ENV === "development" &&
    process.env.SHOW_STACK_TRACE === "true"
  ) {
    errorResponse.stack = err.stack;
  }

  logger.error(`Auth Service Error: ${err.message}`);
  res.status(statusCode).json(errorResponse);
};
