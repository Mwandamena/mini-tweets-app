import { Request, Response } from "express";
import { NotFoundError } from "./errorHandler";

export const notFoundHandler = (req: Request, res: Response) => {
  throw new NotFoundError(`Route ${req.originalUrl} not found`);
};
