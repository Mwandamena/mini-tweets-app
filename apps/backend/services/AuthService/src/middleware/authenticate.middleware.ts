import { ApiResponse, BadRequestError, InternalServerError } from "@mta/common";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import logger from "../config/logger";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let authHeader = req.headers.authorization;
  let token = "";

  if (!authHeader) {
    throw new BadRequestError("Authorization header is missing");
  }

  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    throw new BadRequestError(
      "Invalid Authorization format. Expected 'Bearer <token>'."
    );
  }

  if (!token) {
    throw new BadRequestError(
      "Authentication token must be provided to access resource"
    );
  }

  try {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "secret_key",
      (err: any, decoded: any) => {
        if (err) {
          logger.error(
            "[Authentication]: Token authentication failed.",
            err.message
          );
          return res
            .status(401)
            .json(
              ApiResponse.unauthorized(
                res,
                "Authentication Failed. Token is either invalid or expired."
              )
            );
        } else {
          logger.info(
            "[Auth Authentication]: Authentication successful",
            decoded.id
          );
          req.user = decoded;
          next();
        }
      }
    );
  } catch (error) {
    throw new InternalServerError(
      "Something went wrong on our end during token verification"
    );
  }
};
