import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@mta/common";
import { prisma } from "../db/prisma";
import { CacheService } from "./cache.service";
import { objectIdSchema, userUpdateSchema } from "../validators/user.schema";

export class UserService {
  private prisma: any;
  private cacheService: CacheService;

  constructor() {
    this.prisma = prisma;
    this.cacheService = new CacheService();
  }

  /*
   * Get the current user
   */
  async currentUser(userId: string) {
    if (!userId) {
      throw new ForbiddenError("Authentication token is required");
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return { user };
  }

  /*
   * Get a single user
   */
  async singleUser(params: string) {
    if (!params) {
      throw new BadRequestError(
        "ID parameters must be specified for the user to find."
      );
    }

    objectIdSchema.parse(params);

    const user = await this.prisma.user.findUnique({
      where: {
        id: params,
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        profileImage: true,
        isPrivate: true,
        following: true,
        followers: true,
        _count: {
          select: {
            following: true,
            followers: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return { user };
  }

  /*
   * Get all users
   */
  async allUsers() {
    const users = await this.prisma.user.findMany();
    if (!users) {
      throw new NotFoundError(
        "This looks empty. There are no users on the platform yet."
      );
    }
    // cache the users
    await CacheService.cacheUsers("all", users);

    return { users };
  }

  async editUser(
    id: string,
    currentUserId: string,
    data: {
      displayName?: string;
      username?: string;
      bio?: string;
      location?: string;
      website?: string;
      profileImage?: string;
      bannerImage?: string;
      dateOfBirth?: string;
      isPrivate?: boolean;
    }
  ) {
    if (!id) {
      throw new ValidationError(
        "User ID parameter is required to edit user details."
      );
    }

    objectIdSchema.parse(id);

    const keys = Object.keys(data);

    const hasValidDetails = keys.some((key) => {
      const value = data[key as keyof typeof data];
      if (key === "id") return false;
      return value !== null && value !== undefined && value !== "";
    });

    if (!hasValidDetails) {
      throw new ValidationError("Details to edit user required");
    }

    userUpdateSchema.parse(data);

    const targetUser = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!targetUser) {
      throw new NotFoundError("User to edit not found");
    }

    if (currentUserId !== targetUser.id) {
      throw new ForbiddenError(
        "Forbidden! You are not allowed to edit this user."
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUserId },
      data: {
        profileImage: data.profileImage,
        username: data.username,
        displayName: data.displayName,
        bio: data.bio,
        website: data.website,
        isPrivate: data.isPrivate,
        dateOfBirth: data.dateOfBirth
          ? `${data.dateOfBirth}T00:00:00.000Z`
          : undefined,
        location: data.location,
        bannerImage: data.bannerImage,
      },
    });

    return { updatedUser };
  }

  async userFollowers(userId: string) {
    if (!userId) {
      throw new BadRequestError(
        "User Id must be provided to view your followers"
      );
    }
    objectIdSchema.parse(userId);

    const followers = await prisma.follow.findMany({
      where: {
        followingId: userId,
        status: "ACCEPTED",
      },
    });

    return { followers, message: "User followers fetched successfully" };
  }

  async userFollowing(userId: string) {
    if (!userId) {
      throw new BadRequestError(
        "User Id must be provided to view your followers"
      );
    }
    objectIdSchema.parse(userId);

    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
        status: "ACCEPTED",
      },
    });

    return { following, message: "User following fetched successfully" };
  }

  // UTILITY FUNCTIONS
  public static isUserOwner(requesterId: string, targetId: string) {
    if (requesterId !== targetId) {
      throw new ForbiddenError(
        "Forbidden! You are not authorized to perform this action."
      );
    }
    return true;
  }

  public static async checkUserExists(userId: string) {
    if (!userId) {
      throw new BadRequestError("User ID is required.");
    }

    try {
      objectIdSchema.parse(userId);
    } catch (error) {
      throw new ValidationError("Invalid User ID format.");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  public static async checkUsernameAvailableStatic(username: string) {
    if (!username) {
      throw new ValidationError("Username is required.");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username: username.toLowerCase(),
      },
    });

    if (existingUser) {
      throw new BadRequestError(`Username @${username} is already taken.`);
    }
    return true;
  }

  public async batchExists(userIds: string[]) {
    if (!userIds || !Array.isArray(userIds)) {
      throw new BadRequestError("User IDs array is required");
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        profileImage: true,
        isPrivate: true,
        isActive: true,
        following: true,
        followers: true,
        _count: {
          select: {
            following: true,
            followers: true,
          },
        },
      },
    });

    return { users };
  }

  public async getUsersByUsername(usernames: string[]) {
    if (!usernames || !Array.isArray(usernames)) {
      throw new BadRequestError("Usernames are required to get usernames");
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          in: usernames.map((u: string) => u.toLowerCase()),
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        profileImage: true,
        isPrivate: true,
      },
    });

    return { users };
  }
}
