import { BadRequestError, NotFoundError, UnauthorizedError } from "@mta/common";
import { prisma } from "../db/prisma";
import { UserServiceClient } from "@mta/api-client";
import { map } from "zod";

const tweetSelect = {
  id: true,
  content: true,
  authorId: true,
  media: true,
  createdAt: true,
  viewCount: true,
  _count: {
    select: { likes: true, retweets: true, replies: true },
  },
};

export class TimelineService {
  private userServiceClient: UserServiceClient;
  constructor() {
    this.userServiceClient = new UserServiceClient();
  }

  private async getUserById(userId: string) {
    const user = await this.userServiceClient.getUserById(userId);
    if (!user) throw new NotFoundError("User not found.");
    return user;
  }

  private async getUsersByIds(userIds: string[]) {
    const users = await this.userServiceClient.getUsersByIds(userIds);
    if (!users) throw new NotFoundError("Users not found.");
    return users;
  }

  //   private async getPopularAuthorIds() {
  //     const popular = await this.userServiceClient.getPopularAuthors();
  //     return popular;
  //   }

  async following(userId: string, page: number = 1, limit: number = 20) {
    if (!userId) throw new UnauthorizedError("User Id is required.");

    const skip = (page - 1) * limit;

    const user = await this.getUserById(userId);

    const followingIds = await this.getUsersByIds(
      user.following
        .filter((f) => f.status === "ACCEPTED")
        .map((f) => f.followingId)
    );

    const successfullyFetchedIds: string[] = Array.from(
      followingIds.keys()
    ).map((id) => id);

    if (successfullyFetchedIds.length === 0) {
      return { tweets: [], meta: { page, limit, count: 0, total: 0 } };
    }

    const tweets = await prisma.tweet.findMany({
      where: {
        authorId: { in: successfullyFetchedIds },
        isReply: false,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: skip,
      select: tweetSelect,
    });

    return {
      tweets,
      meta: { page, limit, count: tweets.length },
    };
  }

  async home(userId: string, page: number = 1, limit: number = 20) {
    if (!userId) throw new UnauthorizedError("Authentication is required.");

    const skip = (page - 1) * limit;

    const [followingIds, popularAuthorIds] = await Promise.all([
      this.getUserById(userId),
      this.getUsersByIds([userId]),
    ]);

    const stringIds: string[] = Array.from(
      followingIds.following
        .filter((f) => f.status === "ACCEPTED")
        .map((f) => f.followingId)
    );

    const tweets = await prisma.tweet.findMany({
      where: {
        authorId: { in: stringIds },
        isReply: false,
      },
      orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
      take: limit,
      skip: skip,
      select: tweetSelect,
    });

    const users = await this.getUsersByIds(stringIds);

    const richTweets = tweets.map((tweet) => ({
      ...tweet,
      author:
        users
          .get(tweet.authorId)
          ?.following.filter((f) => f.status === "ACCEPTED") || null,
    }));

    return {
      tweets: richTweets,
      meta: { page, limit, count: tweets.length },
    };
  }

  //   async community(
  //     userId: string,
  //     name: string,
  //     page: number = 1,
  //     limit: number = 20
  //   ) {
  //     if (!userId) throw new UnauthorizedError("Authentication is required.");
  //     if (!name) throw new BadRequestError("Community name is required.");

  //     const skip = (page - 1) * limit;

  //     const communityData = await userServiceClient.getCommunityDetailsAndMembers(
  //       name,
  //       userId
  //     );

  //     if (!communityData.isMember && !communityData.isPublic) {
  //       throw new ForbiddenError(
  //         "Access denied: Not a member of this community."
  //       );
  //     }

  //     const authorizedAuthorIds = communityData.memberIds;
  //     const tweets = await prisma.tweet.findMany({
  //       where: {
  //         authorId: { in: authorizedAuthorIds },
  //         isReply: false,
  //       },
  //       orderBy: { createdAt: "desc" },
  //       take: limit,
  //       skip: skip,
  //       select: tweetSelect,
  //     });

  //     return {
  //       tweets,
  //       meta: {
  //         page,
  //         limit,
  //         count: tweets.length,
  //         community: communityData.details.name,
  //       },
  //     };
  //   }

  //   async trending(
  //     userId: string | null = null,
  //     country: string | null = null,
  //     page: number = 1,
  //     limit: number = 20
  //   ) {
  //     const skip = (page - 1) * limit;

  //     const trendingScope = country ? { country: country.toUpperCase() } : {};

  //     const tweets = await prisma.tweet.findMany({
  //       where: {
  //         isReply: false,
  //       },
  //       orderBy: [{ viewCount: "desc" }, { createdAt: "desc" }],
  //       take: limit,
  //       skip: skip,
  //       select: tweetSelect,
  //     });

  //     return {
  //       tweets,
  //       meta: { page, limit, count: tweets.length, scope: country || "Global" },
  //     };
  //   }
}
