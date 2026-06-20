import { getLogger } from "@mta/logger";
import { NextFunction, Request, Response } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const logger = getLogger("@mta/request", "info");
  logger.debug(`[${req.method}] ${req.originalUrl}`);
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `[${req.method}] ${req.originalUrl} - status: ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};
