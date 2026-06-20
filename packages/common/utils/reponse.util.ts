import { Response } from "express";
import { randomUUID } from "crypto";
import { ERROR_CODES, HTTP_STATUS } from "../constants";

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = HTTP_STATUS.OK,
    meta?: any
  ) {
    const response = {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId || randomUUID(),
        ...meta,
      },
    };

    return res.status(statusCode).json(response);
  }

  /**
   * send a created response
   * */
  static created<T>(
    res: Response,
    data: T,
    message: string = "Resource created successfully"
  ) {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  /**
   * Send a no content response (204)
   */
  static noContent(res: Response) {
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  /**
   * Send an error response
   */
  // Inside ApiResponse class
  static error(
    res: Response,
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errorCode: string = ERROR_CODES.INTERNAL_SERVER_ERROR,
    details?: any
  ) {
    let errorDetails = details;

    if (details && typeof details === "object" && details.stack) {
      errorDetails = {
        name: details.name,
        message: details.message,
        stack: details.stack,
      };
    }

    const response = {
      success: false,
      message,
      error: {
        code: errorCode,
        details: errorDetails,
        stack:
          process.env.NODE_ENV === "development"
            ? errorDetails?.stack
            : undefined,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: res.locals.requestId || randomUUID(),
        path: res.req?.originalUrl,
      },
    };

    return res.status(statusCode).json(response);
  }

  /**
   * Send a bad request response (400)
   */
  static badRequest(
    res: Response,
    message: string = "Bad request",
    details?: any
  ) {
    return this.error(
      res,
      message,
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.BAD_REQUEST,
      details
    );
  }

  /**
   * Send an unauthorized response (401)
   */
  static unauthorized(
    res: Response,
    message: string = "Authentication required"
  ) {
    return this.error(
      res,
      message,
      HTTP_STATUS.UNAUTHORIZED,
      ERROR_CODES.UNAUTHORIZED
    );
  }

  /**
   * Send a forbidden response (403)
   */
  static forbidden(res: Response, message: string = "Access forbidden") {
    return this.error(
      res,
      message,
      HTTP_STATUS.FORBIDDEN,
      ERROR_CODES.FORBIDDEN
    );
  }

  /**
   * Send a not found response (404)
   */
  static notFound(res: Response, message: string = "Resource not found") {
    return this.error(
      res,
      message,
      HTTP_STATUS.NOT_FOUND,
      ERROR_CODES.NOT_FOUND
    );
  }

  /**
   * Send a conflict response (409)
   */
  static conflict(res: Response, message: string = "Resource already exists") {
    return this.error(res, message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
  }

  /**
   * Send a validation error response (422)
   */
  static validationError(
    res: Response,
    message: string = "Validation failed",
    errors: any[]
  ) {
    return this.error(
      res,
      message,
      HTTP_STATUS.VALIDATION_ERROR,
      ERROR_CODES.VALIDATION_ERROR,
      { errors }
    );
  }

  /**
   * Send a server error response (500)
   */
  static serverError(
    res: Response,
    message: string = "Internal server error",
    error?: any
  ) {
    return this.error(
      res,
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      error
    );
  }

  /**
   * Send a service unavailable response (503)
   */
  static serviceUnavailable(
    res: Response,
    message: string = "Service temporarily unavailable"
  ) {
    return this.error(
      res,
      message,
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      ERROR_CODES.SERVICE_UNAVAILABLE
    );
  }

  /**
   * Send a paginated response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = "Data retrieved successfully"
  ) {
    const totalPages = Math.ceil(total / limit);

    return this.success(res, data, message, HTTP_STATUS.OK, {
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  }
}
