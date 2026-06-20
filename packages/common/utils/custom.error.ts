import { ERROR_CODES, HTTP_STATUS } from "../constants";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request", details?: any) {
    super(message, HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden") {
    super(message, HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, HTTP_STATUS.CONFLICT, ERROR_CODES.CONFLICT);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed", errors?: any[]) {
    super(message, HTTP_STATUS.VALIDATION_ERROR, ERROR_CODES.CONFLICT, {
      errors,
    });
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal server error", details?: any) {
    super(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ERROR_CODES.INTERNAL_SERVER_ERROR,
      details
    );
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service temporarily unavailable") {
    super(
      message,
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      ERROR_CODES.SERVICE_UNAVAILABLE
    );
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = "Too many requests") {
    super(
      message,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      ERROR_CODES.TOO_MANY_REQUESTS
    );
  }
}

export class ExpiredTokenOrCode extends AppError {
  constructor(message: string = "Token or code expired") {
    super(message, HTTP_STATUS.GONE, ERROR_CODES.EXPIRED_TOKEN_OR_CODE);
  }
}
