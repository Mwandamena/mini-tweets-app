import { ApiResponse, asyncHandler } from "@mta/common";
import { Request, Response } from "express";
import { TimelineService } from "../services/timeline.service";

export class TimelineController {
  private timelineService: TimelineService;
  constructor() {
    this.timelineService = new TimelineService();
  }

  following = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { tweets } = await this.timelineService.following(userId);
    return ApiResponse.success(res, tweets);
  });

  home = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { tweets } = await this.timelineService.home(userId);
    return ApiResponse.success(res, tweets);
  });

  community = asyncHandler(async (req: Request, res: Response) => {});

  trending = asyncHandler(async (req: Request, res: Response) => {});
}
