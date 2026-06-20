import { BadRequestError, NotFoundError } from "@mta/common";
import { prisma } from "../db/prisma";

const tweetSelect = {
  id: true,
  content: true,
  authorId: true,
  media: true,
  createdAt: true,
  _count: {
    select: { likes: true, retweets: true, replies: true },
  },
};

export class HashtagService {
  constructor() {}

  async getTweetsByHashtag(
    name: string,
    page: string | number = 1,
    limit: string | number = 20
  ) {
    if (!name || name.length < 2) {
      throw new BadRequestError("Hashtag name must be at least 2 characters.");
    }

    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 20;
    const skip = (parsedPage - 1) * parsedLimit;

    const lowerName = name.toLowerCase();

    const hashtag = await prisma.hashtag.findUnique({
      where: { name: lowerName },
      select: { id: true, name: true },
    });

    if (!hashtag) {
      return {
        tweets: [],
        meta: { page: parsedPage, limit: parsedLimit, count: 0, total: 0 },
      };
    }

    const tweetHashtags = await prisma.tweetHashtag.findMany({
      where: { hashtagId: hashtag.id },
      orderBy: { tweet: { createdAt: "desc" } },
      take: parsedLimit,
      skip: skip,
      include: {
        tweet: {
          select: tweetSelect,
        },
      },
    });

    const totalCount = await prisma.tweetHashtag.count({
      where: { hashtagId: hashtag.id },
    });

    const tweets = tweetHashtags.map((th) => th.tweet);

    return {
      tweets,
      meta: {
        page: parsedPage,
        limit: parsedLimit,
        count: tweets.length,
        total: totalCount,
      },
    };
  }

  async getTrendingHashtags(count: number = 10) {
    const trending = await prisma.hashtag.findMany({
      take: count,
      orderBy: {
        tweets: {
          _count: "desc",
        },
      },
      select: {
        name: true,
        _count: {
          select: { tweets: true },
        },
      },
    });
    const formattedTrends = trending.map((tag) => ({
      name: `#${tag.name}`,
      usageCount: tag._count.tweets,
    }));

    return formattedTrends;
  }
}
