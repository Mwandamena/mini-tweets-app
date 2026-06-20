import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, TokenPayload } from "./token.utils";
import { getLogger } from "@mta/logger";
import { ApiResponse } from "../utils/reponse.util";
import { ExpiredTokenOrCode } from "../utils/custom.error";

// get the logger
const logger = getLogger("@mta/common/auth", "debug");

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    sessionId?: string;
  };
  token?: TokenPayload;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const serviceName = process.env.SERVICE_NAME || "Unknown";

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(`[${serviceName}]: No authorization header provided`);
      res.status(401).json({
        error: "Unauthorized",
        message: "No token provided",
        code: "NO_TOKEN",
      });
      return;
    }

    const token = authHeader.substring(7);

    if (!token) {
      logger.warn(`[${serviceName}]: Empty token`);
      res.status(401).json({
        error: "Unauthorized",
        message: "Invalid token format",
        code: "INVALID_FORMAT",
      });
      return;
    }

    try {
      const decoded = verifyAccessToken(token);
      logger.info(`[${serviceName}]: Token verified for user ${decoded.id}`);

      (req as AuthenticatedRequest).user = {
        id: decoded.id,
        sessionId: decoded.sessionId,
      };
      (req as AuthenticatedRequest).token = decoded;

      next();
    } catch (error: any) {
      console.warn(
        `[${serviceName}]: Token verification failed:`,
        error.message
      );

      if (error.message === "Access token expired") {
        throw new ExpiredTokenOrCode(
          "Access token is expired. Please request a new one."
        );
      }

      if (error.message === "Invalid token type") {
        throw new ExpiredTokenOrCode(
          "Invalid access token type. Please request a new one."
        );
      }

      if (error.message === "Invalid access token") {
        throw new ExpiredTokenOrCode(
          "Access token is invalid. Please request a new one."
        );
      }

      // Generic token error
      throw new ExpiredTokenOrCode(
        "Access token is expired or invalid. Please request a new one."
      );
    }
  } catch (error: any) {
    logger.error(`[${serviceName}]: Authentication middleware error:`, {
      message: error.message,
      stack: error.stack,
    });

    if (!res.headersSent) {
      ApiResponse.serverError(res, "Authentication Failed!");
    }
  }
};

export const optionalAuthenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  try {
    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    (req as AuthenticatedRequest).user = {
      id: decoded.id,
      sessionId: decoded.sessionId,
    };
    (req as AuthenticatedRequest).token = decoded;
  } catch (error) {
    logger.warn("Optional auth failed, continuing without user");
  }

  next();
};
