import { BadRequestError, NotFoundError, ForbiddenError } from "@mta/common";
import { prisma } from "../db/prisma";
import {
  TweetCreateInput,
  TweetUpdateInput,
  tweetCreateSchema,
  tweetUpdateSchema,
} from "../validators/tweet.schema";
import { UserServiceClient } from "@mta/api-client";
import { response } from "express";
import {
  KAFKA_TOPICS,
  TweetCreatedEvent,
  TweetEvent,
  TweetMentionedEvent,
  TweetRepliedEvent,
} from "@mta/constants";
import { producer } from "../events/kafka";
// import redis from "../config/redis";

export class TweetsService {
  private userServiceClient: UserServiceClient;
  constructor() {
    this.userServiceClient = new UserServiceClient();
  }

  private async getTweetById(tweetId: string) {
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
    });

    if (!tweet) {
      throw new NotFoundError("The tweet you requested was not found");
    }
    return tweet;
  }

  private async getUserById(userId: string) {
    const user = await this.userServiceClient.getUserById(userId);
    if (!user) return null;
    return user;
  }

  private parseContent(content: string) {
    const hashtagRegex = /#(\w+)/g;
    const mentionRegex = /@(\w+)/g;
    const hashtags = [...content.matchAll(hashtagRegex)].map((m) =>
      m[1].toLowerCase()
    );
    const mentions = [...content.matchAll(mentionRegex)].map((m) =>
      m[1].toLowerCase()
    );
    return {
      uniqueHashtags: [...new Set(hashtags)],
      uniqueMentions: [...new Set(mentions)],
    };
  }

  async createTweet(userId: string, data: TweetCreateInput) {
    if (!userId)
      throw new BadRequestError("User ID required to create a tweet");

    if (!data) {
      throw new BadRequestError("Missing required data to create a tweet");
    }

    tweetCreateSchema.parse(data);

    const { uniqueHashtags, uniqueMentions } = this.parseContent(data.content);

    const mentionedUsersMap =
      await this.userServiceClient.getUsersByUsernames(uniqueMentions);

    const validMentionIds: string[] = [];

    for (const username of uniqueMentions) {
      const userProfile = mentionedUsersMap.get(username.toLowerCase());

      if (userProfile && userProfile.id) {
        validMentionIds.push(userProfile.id);
      }
    }

    const user = await this.getUserById(userId);

    const tweet = await prisma.tweet.create({
      data: {
        content: data.content,
        authorId: userId,
        media: data.media || [],
        isReply: false,

        hashtags: {
          create: uniqueHashtags.map((tag) => ({
            hashtag: {
              connectOrCreate: {
                where: { name: tag },
                create: { name: tag },
              },
            },
          })),
        },

        mentions: {
          create: validMentionIds.map((mentionedUserId) => ({
            mentionedUserId: mentionedUserId,
          })),
        },
      },
      include: {
        hashtags: true,
        likes: true,
        bookmarks: true,
        mentions: true,
      },
    });

    const response = {
      ...user,
      tweet,
    };

    // fire mentions event
    if (validMentionIds.length > 0) {
      const mentionsEvent: Omit<
        TweetMentionedEvent,
        "eventId" | "timestamp" | "version"
      > = {
        eventType: KAFKA_TOPICS.TWEET.MENTIONED,
        payload: {
          tweetId: tweet.id,
          userId: userId,
          mentionedUserId: validMentionIds,
          mentionedAt: Date.now(),
        },
      };

      await producer.publish<TweetEvent>(
        KAFKA_TOPICS.TWEET.MENTIONED,
        mentionsEvent
      );
    }

    // create event to update tweet on user
    const p: Omit<TweetCreatedEvent, "eventId" | "timestamp" | "version"> = {
      eventType: KAFKA_TOPICS.TWEET.CREATED,
      payload: {
        tweetId: tweet.id,
        userId: userId,
        content: tweet.content,
        visibility: "public",
        sensitive: false,
        createdAt: Date.now(),
      },
    };

    await producer.publish<TweetEvent>(KAFKA_TOPICS.TWEET.CREATED, p);

    return { response, message: "Tweet posted successfully." };
  }

  async replyTweet(userId: string, tweetId: string, data: TweetCreateInput) {
    if (!userId || !tweetId) throw new BadRequestError("Missing required IDs.");

    const parentTweet = await this.getTweetById(tweetId);

    const { uniqueHashtags, uniqueMentions } = this.parseContent(data.content);

    const mentionedUsersMap =
      await this.userServiceClient.getUsersByUsernames(uniqueMentions);

    const validMentionIds: string[] = [];

    for (const username of uniqueMentions) {
      const userProfile = mentionedUsersMap.get(username.toLowerCase());

      if (userProfile && userProfile.id) {
        validMentionIds.push(userProfile.id);
      }
    }

    const user = await this.getUserById(userId);

    const reply = await prisma.tweet.create({
      data: {
        content: data.content,
        authorId: userId,
        media: data.media || [],
        isReply: true,
        replyToId: parentTweet.id,
        hashtags: {
          create: uniqueHashtags.map((tag) => ({
            hashtag: {
              connectOrCreate: { where: { name: tag }, create: { name: tag } },
            },

            mentions: {
              create: validMentionIds.map((mentionedUserId) => ({
                mentionedUserId: mentionedUserId,
              })),
            },
          })),
        },
      },
    });

    const response = {
      ...user,
      reply,
    };

    // events go here
    const p: Omit<TweetRepliedEvent, "eventId" | "timestamp" | "version"> = {
      eventType: KAFKA_TOPICS.TWEET.REPLIED,
      payload: {
        replyTweetId: reply.id,
        originalTweetId: parentTweet.id,
        originalAuthorId: parentTweet.authorId,
        userId: user?.id || reply.authorId,
        repliedAt: Date.now(),
      },
    };

    await producer.publish<TweetEvent>(KAFKA_TOPICS.TWEET.REPLIED, p);

    return { response, message: "Reply posted successfully." };
  }

  async editTweet(userId: string, tweetId: string, data: TweetUpdateInput) {
    if (!userId || !tweetId)
      throw new BadRequestError(
        "User ID and tweet ID is missing in the request"
      );

    const tweet = await this.getTweetById(tweetId);

    if (tweet.authorId !== userId) {
      throw new ForbiddenError("You can only edit your own tweets.");
    }

    const updatedTweet = await prisma.tweet.update({
      where: { id: tweetId },
      data: {
        content: data.content,
        media: data.media,
        updatedAt: new Date(),
      },
    });

    return { updatedTweet, message: "Tweet updated successfully." };
  }

  async deleteTweet(userId: string, tweetId: string) {
    if (!userId || !tweetId) throw new BadRequestError("Missing IDs.");

    const tweet = await this.getTweetById(tweetId);

    if (tweet.authorId !== userId) {
      throw new ForbiddenError("You can only delete your own tweets.");
    }

    await prisma.tweet.delete({
      where: { id: tweetId },
    });

    return { message: "Tweet deleted successfully." };
  }

  async getTweet(tweetId: string) {
    if (!tweetId) throw new BadRequestError("Tweet ID required.");

    const et = await prisma.tweet.update({
      where: { id: tweetId },
      data: { viewCount: { increment: 1 } },
    });

    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
      include: {
        _count: {
          select: {
            likes: true,
            retweets: true,
            replies: true,
            bookmarks: true,
          },
        },
      },
    });

    const user = await this.getUserById(et.authorId);

    if (!tweet) throw new NotFoundError("Tweet not found.");

    const response = {
      ...user,
      tweet,
    };

    return { response };
  }

  async getUserTweets(targetUserId: string, page = 1, limit = 20) {
    if (!targetUserId) throw new BadRequestError("Target User ID required.");

    const skip = (page - 1) * limit;

    const user = await this.getUserById(targetUserId);

    const tweets = await prisma.tweet.findMany({
      where: {
        authorId: targetUserId,
        isReply: false,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
      include: {
        _count: {
          select: { likes: true, retweets: true, replies: true },
        },
      },
    });

    const response = tweets.map((tweet) => {
      return {
        ...user,
        tweet,
      };
    });

    return {
      tweets: response,
      meta: { page, limit, count: tweets.length },
    };
  }

  async getUserReplies(targetUserId: string, page = 1, limit = 20) {
    if (!targetUserId) throw new BadRequestError("Target User ID required.");

    const skip = (page - 1) * limit;

    const user = await this.getUserById(targetUserId);

    const replies = await prisma.tweet.findMany({
      where: {
        authorId: targetUserId,
        isReply: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
      include: {
        replyTo: {
          select: {
            id: true,
            content: true,
          },
        },
        _count: {
          select: { likes: true, retweets: true, replies: true },
        },
      },
    });

    const response = replies.map((reply) => {
      return {
        ...user,
        reply,
      };
    });

    return {
      replies: response,
      meta: { page, limit, count: replies.length },
    };
  }

  // get user tweets by id
  async getUserTweetsById(targetUserId: string, page = 1, limit = 20) {
    if (!targetUserId) throw new BadRequestError("Target User ID required.");

    const skip = (page - 1) * limit;

    const user = await this.getUserById(targetUserId);

    const tweets = await prisma.tweet.findMany({
      where: {
        authorId: targetUserId,
        isReply: false,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
      include: {
        _count: {
          select: { likes: true, retweets: true, replies: true },
        },
      },
    });

    const response = tweets.map((tweet) => {
      return {
        ...user,
        tweet,
      };
    });

    return {
      tweets: response,
      meta: { page, limit, count: tweets.length },
    };
  }

  // get user replies by id
  async getUserRepliesById(targetUserId: string, page = 1, limit = 20) {
    if (!targetUserId) throw new BadRequestError("Target User ID required.");

    const skip = (page - 1) * limit;

    const user = await this.getUserById(targetUserId);

    const replies = await prisma.tweet.findMany({
      where: {
        authorId: targetUserId,
        isReply: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
      include: {
        replyTo: {
          select: {
            id: true,
            content: true,
          },
        },
        _count: {
          select: { likes: true, retweets: true, replies: true },
        },
      },
    });

    const response = replies.map((reply) => {
      return {
        ...user,
        reply,
      };
    });

    return {
      replies: response,
      meta: { page, limit, count: replies.length },
    };
  }
}
