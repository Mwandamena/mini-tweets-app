import * as express from "express";

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        exp: number;
        iat: number;
        sessionId: string;
      };
      token: string;
    }
  }
}
