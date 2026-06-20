import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export const requestIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = (req.headers["x-request-id"] as string) || randomUUID();
  res.locals.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);
  next();
};
