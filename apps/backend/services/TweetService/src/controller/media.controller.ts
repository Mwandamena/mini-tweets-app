import { asyncHandler } from "@mta/common";
import { NextFunction, Request, Response } from "express";

export class MediaController {
  constructor() {}
  upload = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );

  delete = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {}
  );
}
