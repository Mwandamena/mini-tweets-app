import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "@mta/common";
import { prisma } from "../db/prisma";
import { objectIdSchema } from "../validators/tweet.schema";
import {
  KAFKA_TOPICS,
  TweetEvent,
  TweetLikedEvent,
  TweetRetweetedEvent,
} from "@mta/constants";
import { producer } from "../events/kafka";
import { UserServiceClient } from "@mta/api-client";

const engagementInclude = {
  tweet: {
    select: {
      id: true,
      content: true,
      authorId: true,
      media: true,
      createdAt: true,
      _count: {
        select: { likes: true, retweets: true, replies: true },
      },
    },
  },
};

export class EngagementService {
  private userServiceClient: UserServiceClient;
  constructor() {
    this.userServiceClient = new UserServiceClient();
  }

  private async getUserById(userId: string) {
    const user = await this.userServiceClient.getUserById(userId);
    if (!user) throw new NotFoundError("User not found.");
    return user;
  }

  private async checkTweetExistence(tweetId: string) {
    if (!tweetId) throw new BadRequestError("Tweet Id is required.");
    objectIdSchema.parse(tweetId);
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
      select: {
        id: true,
        authorId: true,
        likes: true,
        retweets: true,
        mentions: true,
        content: true,
      },
    });
    if (!tweet) {
      throw new NotFoundError("Tweet not found.");
    }
    return tweet;
  }

  public like = async (tweetId: string, authUserId: string) => {
    if (!authUserId) throw new BadRequestError("User Id is required.");
    if (!tweetId) throw new BadRequestError("Tweet Id is required.");

    const existingTweet = await this.checkTweetExistence(tweetId);

    // check if tweet was already liked
    if (existingTweet.likes.some((like) => like.userId === authUserId)) {
      throw new ConflictError("You already liked this tweet.");
    }

    const like = await prisma.like.create({
      data: {
        tweetId: tweetId,
        userId: authUserId,
      },
    });

    const author = await this.getUserById(existingTweet.authorId);
    const user = await this.getUserById(authUserId);

    // fire event here
    const p: Omit<TweetLikedEvent, "eventId" | "timestamp" | "version"> = {
      eventType: KAFKA_TOPICS.TWEET.LIKED,
      payload: {
        tweetId: like.tweetId,
        userId: authUserId,
        email: author.email,
        username: user.username,
        authorUsername: author.username,
        authorDisplayName: author.displayName,
        content: existingTweet.content,
        tweetAuthorId: existingTweet.authorId,
        likedAt: Date.now(),
      },
    };

    await producer.publish<TweetEvent>(KAFKA_TOPICS.TWEET.LIKED, p);

    return { like, message: "Tweet liked successfully." };
  };

  public unlike = async (tweetId: string, authUserId: string) => {
    if (!authUserId) throw new BadRequestError("User Id is required required.");
    if (!tweetId) throw new BadRequestError("Tweet Id is required.");

    const tweet = await this.checkTweetExistence(tweetId);

    // check if user liked this tweet
    if (!tweet.likes.some((like) => like.userId === authUserId)) {
      throw new BadRequestError("You did not like this tweet.");
    }

    const result = await prisma.like.deleteMany({
      where: {
        tweetId: tweetId,
        userId: authUserId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundError("Like not found.");
    }
    return { message: "Tweet unliked successfully." };
  };

  public retweet = async (
    tweetId: string,
    authUserId: string,
    comment?: string
  ) => {
    if (!authUserId) throw new BadRequestError("User Id is required.");
    if (!tweetId) throw new BadRequestError("Tweet Id is required.");

    const tweet = await this.checkTweetExistence(tweetId);

    // check if user retweeted this tweet
    if (tweet.retweets.some((retweet) => retweet.userId === authUserId)) {
      throw new ConflictError("You already retweeted this tweet.");
    }

    const retweet = await prisma.retweet.create({
      data: {
        tweetId: tweetId,
        userId: authUserId,
        comment: comment || null,
      },
    });

    // fire event here
    const p: Omit<TweetRetweetedEvent, "eventId" | "timestamp" | "version"> = {
      eventType: KAFKA_TOPICS.TWEET.RETWEETED,
      payload: {
        originalTweetId: tweetId,
        tweetAuthorId: tweet.authorId,
        retweetId: retweet.id,
        userId: authUserId,
        retweetedAt: Date.now(),
      },
    };

    await producer.publish<TweetEvent>(KAFKA_TOPICS.TWEET.RETWEETED, p);

    return { retweet, message: "Tweet retweeted successfully." };
  };

  public unretweet = async (tweetId: string, authUserId: string) => {
    if (!authUserId) throw new BadRequestError("User Id is required.");
    if (!tweetId) throw new BadRequestError("Tweet Id is required.");

    const tweet = await this.checkTweetExistence(tweetId);

    // check if user is deleting their own retweet
    if (!tweet.retweets.some((r) => r.userId === authUserId)) {
      throw new BadRequestError("You did not retweet this tweet.");
    }

    const result = await prisma.retweet.deleteMany({
      where: {
        tweetId: tweetId,
        userId: authUserId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundError("Retweet not found.");
    }

    return { message: "Retweet removed successfully." };
  };

  public getUserLikes = async (targetUserId: string, page = 1, limit = 20) => {
    if (!targetUserId) throw new BadRequestError("Target User ID required.");

    objectIdSchema.parse(targetUserId);

    const parsedPage = parseInt(page as any, 10) || 1;
    const parsedLimit = parseInt(limit as any, 10) || 20;

    const skip = (parsedPage - 1) * parsedLimit;

    const likes = await prisma.like.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: "desc" },
      take: parsedLimit,
      skip: skip,
      include: engagementInclude,
    });

    if (!likes) {
      throw new NotFoundError("Likes not found.");
    }

    const likedTweets = likes.map((like) => like.tweet);

    return {
      tweets: likedTweets,
      meta: { page: parsedPage, limit: parsedLimit, count: likes.length },
    };
  };

  public getUserRetweets = async (
    targetUserId: string,
    page = 1,
    limit = 20
  ) => {
    if (!targetUserId) throw new BadRequestError("Target User ID required.");

    objectIdSchema.parse(targetUserId);

    const parsedPage = parseInt(page as any, 10) || 1;
    const parsedLimit = parseInt(limit as any, 10) || 20;

    const skip = (parsedPage - 1) * parsedLimit;

    const retweets = await prisma.retweet.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: "desc" },
      take: parsedLimit,
      skip: skip,
      include: {
        tweet: engagementInclude.tweet,
      },
    });

    if (!retweets) {
      throw new NotFoundError("Retweets for this user not found.");
    }

    return {
      retweets,
      meta: { page: parsedPage, limit: parsedLimit, count: retweets.length },
    };
  };

  public getUserMentions = async (
    targetUserId: string,
    page = 1,
    limit = 20
  ) => {
    if (!targetUserId) throw new BadRequestError("Target User ID required.");

    objectIdSchema.parse(targetUserId);

    const parsedPage = parseInt(page as any, 10) || 1;
    const parsedLimit = parseInt(limit as any, 10) || 20;

    const skip = (parsedPage - 1) * parsedLimit;

    const mentions = await prisma.tweetMention.findMany({
      where: { mentionedUserId: targetUserId },
      orderBy: { tweet: { createdAt: "desc" } },
      take: parsedLimit,
      skip: skip,
      include: engagementInclude,
    });

    const mentionedTweets = mentions.map((mention) => mention.tweet);

    return {
      tweets: mentionedTweets,
      meta: { page: parsedPage, limit: parsedLimit, count: mentions.length },
    };
  };

  // get current user likes
  public getCurrentUserLikes = async (userId: string, page = 1, limit = 20) => {
    if (!userId)
      throw new BadRequestError("User ID required to get their likes.");

    objectIdSchema.parse(userId);

    const parsedPage = parseInt(page as any, 10) || 1;
    const parsedLimit = parseInt(limit as any, 10) || 20;

    const skip = (parsedPage - 1) * parsedLimit;

    const likes = await prisma.like.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: parsedLimit,
      skip: skip,
      include: engagementInclude,
    });

    const likedTweets = likes.map((like) => like.tweet);

    return {
      tweets: likedTweets,
      meta: { page: parsedPage, limit: parsedLimit, count: likes.length },
    };
  };

  // get current user retweets
  public getCurrentUserRetweets = async (
    userId: string,
    page = 1,
    limit = 20
  ) => {
    if (!userId)
      throw new BadRequestError("User ID required to get their retweets.");

    objectIdSchema.parse(userId);

    const parsedPage = parseInt(page as any, 10) || 1;
    const parsedLimit = parseInt(limit as any, 10) || 20;

    const skip = (parsedPage - 1) * parsedLimit;

    const retweets = await prisma.retweet.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: parsedLimit,
      skip: skip,
      include: {
        tweet: engagementInclude.tweet,
      },
    });

    return {
      retweets,
      meta: { page: parsedPage, limit: parsedLimit, count: retweets.length },
    };
  };

  // get current user mentions
  public getCurrentUserMentions = async (
    userId: string,
    page = 1,
    limit = 20
  ) => {
    if (!userId)
      throw new BadRequestError("User ID required to get their mentions.");

    objectIdSchema.parse(userId);

    const parsedPage = parseInt(page as any, 10) || 1;
    const parsedLimit = parseInt(limit as any, 10) || 20;

    const skip = (parsedPage - 1) * parsedLimit;

    const mentions = await prisma.tweetMention.findMany({
      where: { mentionedUserId: userId },
      orderBy: { tweet: { createdAt: "desc" } },
      take: parsedLimit,
      skip: skip,
      include: engagementInclude,
    });

    const mentionedTweets = mentions.map((mention) => mention.tweet);

    return {
      tweets: mentionedTweets,
      meta: { page: parsedPage, limit: parsedLimit, count: mentions.length },
    };
  };
}
