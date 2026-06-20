import { ZodError, ZodIssue } from "zod";

export interface ValidationErrorDetail {
  field: string;
  message: string;
  code: string;
}

export class ZodErrorHandler {
  /**
   * Format Zod errors into a clean structure
   */
  static formatZodError(error: ZodError): ValidationErrorDetail[] {
    return error.issues.map((issue: ZodIssue) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }));
  }

  /**
   * Get a user-friendly message from Zod error
   */
  static getErrorMessage(error: ZodError): string {
    const firstError = error.issues[0];
    if (firstError) {
      const field = firstError.path.join(".");
      return field ? `${field}: ${firstError.message}` : firstError.message;
    }
    return "Validation failed";
  }

  /**
   * Check if error is a Zod error
   */
  static isZodError(error: any): error is ZodError {
    return error instanceof ZodError || error.name === "ZodError";
  }
}
