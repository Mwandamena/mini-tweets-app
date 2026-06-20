// tweets controller
import { Request, Response } from "express";
import { TweetsService } from "../services/tweets.service";
import { ApiResponse, asyncHandler } from "@mta/common";

export class TweetController {
  private tweetsService: TweetsService;

  constructor() {
    this.tweetsService = new TweetsService();
  }

  // create a tweet
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { content, media, isQuote, isReply, replyToId } = req.body;

    const { message, response } = await this.tweetsService.createTweet(userId, {
      content,
      media,
      isQuote,
      isReply,
      replyToId,
    });

    return ApiResponse.created(res, { ...response }, message);
  });

  // delete a tweet
  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { tweetId } = req.params;
    const { message } = await this.tweetsService.deleteTweet(
      userId,
      tweetId as string,
    );
    return ApiResponse.success(res, { tweetId }, message);
  });

  // create a tweet
  reply = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { tweetId } = req.params;
    const { content, media, isQuote, isReply, replyToId } = req.body;
    const { message, response } = await this.tweetsService.replyTweet(
      userId,
      tweetId as string,
      {
        content,
        media,
        isQuote,
        isReply,
        replyToId,
      },
    );
    return ApiResponse.created(res, { ...response }, message);
  });

  // edit a tweet
  edit = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { tweetId } = req.params;
    const { content, media } = req.body;
    const { message, updatedTweet } = await this.tweetsService.editTweet(
      userId,
      tweetId as string,
      {
        content,
        media,
      },
    );
    return ApiResponse.success(res, { updatedTweet }, message);
  });

  // get a tweet
  get = asyncHandler(async (req: Request, res: Response) => {
    const { tweetId } = req.params;
    const { response } = await this.tweetsService.getTweet(tweetId as string);
    return ApiResponse.success(
      res,
      { ...response },
      "Tweet fetched successfully",
    );
  });

  // get current user  tweets
  getUserTweets = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { tweets, meta } = await this.tweetsService.getUserTweets(userId);
    return ApiResponse.paginated(
      res,
      tweets,
      meta.page,
      meta.limit,
      meta.count,
    );
  });

  // get current user replies
  getUserReplies = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { replies, meta } = await this.tweetsService.getUserReplies(userId);
    return ApiResponse.paginated(
      res,
      replies,
      meta.page,
      meta.limit,
      meta.count,
    );
  });

  // get user tweets
  getUserTweetsByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { tweets, meta } = await this.tweetsService.getUserTweetsById(
      userId as string,
    );
    return ApiResponse.paginated(
      res,
      tweets,
      meta.page,
      meta.limit,
      meta.count,
    );
  });

  // get user replies
  getUserRepliesByUserId = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { replies, meta } = await this.tweetsService.getUserRepliesById(
      userId as string,
    );
    return ApiResponse.paginated(
      res,
      replies,
      meta.page,
      meta.limit,
      meta.count,
    );
  });
}
