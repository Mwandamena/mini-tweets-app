import { ApiResponse, asyncHandler } from "@mta/common";
import { Request, Response } from "express";
import { EngagementService } from "../services/engagement.service";

export class EngagementController {
  private engagementService: EngagementService;
  constructor() {
    this.engagementService = new EngagementService();
  }

  // like a tweet
  like = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.params;
    const userId = req.user.id;

    const { like, message } = await this.engagementService.like(
      tweetId as string,
      userId,
    );

    return ApiResponse.created(res, { like }, message);
  });

  // unlike a tweet
  unlike = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.params;
    const userId = req.user.id;

    const { message } = await this.engagementService.unlike(
      tweetId as string,
      userId,
    );

    return ApiResponse.success(res, {}, message);
  });

  // retweet a tweet
  retweet = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.params;
    const userId = req.user.id;
    const { comment } = req.body;

    const { retweet, message } = await this.engagementService.retweet(
      tweetId as string,
      userId,
      comment,
    );

    return ApiResponse.created(res, { retweet }, message);
  });

  // unretweet a tweet
  unretweet = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.params;
    const userId = req.user.id;

    const { message } = await this.engagementService.unretweet(
      tweetId as string,
      userId,
    );

    return ApiResponse.success(res, {}, message);
  });

  // get user likes
  getUserLikes = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { page, limit } = req.query;

    const { tweets, meta } = await this.engagementService.getUserLikes(
      userId as string,
      Number(page),
      Number(limit),
    );

    return ApiResponse.paginated(
      res,
      tweets,
      meta.page,
      meta.limit,
      meta.count,
    );
  });

  // get user retweets
  getUserRetweets = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { page, limit } = req.query;

    const { retweets, meta } = await this.engagementService.getUserRetweets(
      userId as string,
      Number(page),
      Number(limit),
    );

    return ApiResponse.paginated(
      res,
      retweets,
      meta.page,
      meta.limit,
      meta.count,
    );
  });

  // get user mentions
  getUserMentions = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { page, limit } = req.query;

    const { tweets, meta } = await this.engagementService.getUserMentions(
      userId as string,
      Number(page),
      Number(limit),
    );

    return ApiResponse.paginated(
      res,
      tweets,
      meta.page,
      meta.limit,
      meta.count,
    );
  });

  // get current user likes
  getCurrentUserLikes = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const userId = req.user.id;

    const { tweets, meta } = await this.engagementService.getCurrentUserLikes(
      userId,
      Number(page),
      Number(limit),
    );

    return ApiResponse.paginated(
      res,
      tweets,
      meta.page,
      meta.limit,
      meta.count,
    );
  });

  // get current user retweets
  getCurrentUserRetweets = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const userId = req.user.id;

    const { retweets, meta } =
      await this.engagementService.getCurrentUserRetweets(
        userId,
        Number(page),
        Number(limit),
      );

    return ApiResponse.paginated(
      res,
      retweets,
      meta.page,
      meta.limit,
      meta.count,
    );
  });

  // get current user mentions
  getCurrentUserMentions = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query;
    const userId = req.user.id;

    const { tweets, meta } =
      await this.engagementService.getCurrentUserMentions(
        userId,
        Number(page),
        Number(limit),
      );

    return ApiResponse.paginated(
      res,
      tweets,
      meta.page,
      meta.limit,
      meta.count,
    );
  });
}
