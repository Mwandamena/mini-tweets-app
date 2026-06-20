import { BadRequestError, NotFoundError } from "@mta/common";
import { prisma } from "../db/prisma";
import { objectIdSchema } from "../validators/tweet.schema";

const bookmarkSelect = {
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

export class BookmarksService {
  constructor() {}

  private async checkTweetExistence(tweetId: string) {
    objectIdSchema.parse(tweetId);
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
      select: { id: true },
    });
    if (!tweet) {
      throw new NotFoundError("This tweet does not exist.");
    }
    return tweet;
  }

  async createBookmark(tweetId: string, authUserId: string) {
    if (!authUserId) throw new BadRequestError("User Id is required.");
    if (!tweetId) throw new BadRequestError("Tweet Id is required");

    const tweet = await this.checkTweetExistence(tweetId);

    // check if the user has already bookmarked a tweet
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        tweetId_userId: {
          tweetId: tweetId,
          userId: authUserId,
        },
      },
    });

    if (existingBookmark) {
      throw new BadRequestError("You have already bookmarked this tweet.");
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        tweetId: tweetId,
        userId: authUserId,
      },
    });

    return { bookmark, message: "Tweet bookmarked successfully." };
  }

  async deleteBookmark(tweetId: string, authUserId: string) {
    if (!authUserId) throw new BadRequestError("Authentication required.");
    if (!tweetId)
      throw new BadRequestError("Tweet Id is required to delete a bookmark");

    await this.checkTweetExistence(tweetId);

    const result = await prisma.bookmark.deleteMany({
      where: {
        tweetId: tweetId,
        userId: authUserId,
      },
    });

    if (result.count === 0) {
      throw new NotFoundError("Bookmark not found.");
    }

    return { message: "Bookmark removed successfully." };
  }

  async getBookmarks(
    authUserId: string,
    page: string | number = 1,
    limit: string | number = 20
  ) {
    if (!authUserId)
      throw new BadRequestError("User ID is required to get bookmarks.");

    const parsedPage = Number(page) || 1;
    const parsedLimit = Number(limit) || 20;
    const skip = (parsedPage - 1) * parsedLimit;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: authUserId },
      orderBy: { createdAt: "desc" },
      take: parsedLimit,
      skip: skip,
      include: bookmarkSelect,
    });

    const totalCount = await prisma.bookmark.count({
      where: { userId: authUserId },
    });
    const bookmarkedTweets = bookmarks.map((bookmark) => bookmark.tweet);

    return {
      tweets: bookmarkedTweets,
      meta: {
        page: parsedPage,
        limit: parsedLimit,
        count: bookmarkedTweets.length,
        total: totalCount,
      },
    };
  }
}
