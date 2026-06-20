import { ApiResponse, asyncHandler } from "@mta/common";
import { Request, Response } from "express";
import { HashtagService } from "../services/hashtags.service";

export class HashtagController {
  private hashtagService: HashtagService;
  constructor() {
    this.hashtagService = new HashtagService();
  }

  get = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.params;
    const { tweets, meta } = await this.hashtagService.getTweetsByHashtag(
      name as string,
    );
    return ApiResponse.paginated(
      res,
      tweets,
      meta.page,
      meta.limit,
      meta.count,
    );
  });

  trending = asyncHandler(async (req: Request, res: Response) => {
    const hashtags = await this.hashtagService.getTrendingHashtags();
    return ApiResponse.success(
      res,
      hashtags,
      "Trending hashtags fetched successfully",
    );
  });
}
