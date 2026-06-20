import { BadRequestError, ConflictError, NotFoundError } from "@mta/common";
import { UserService } from "./user.service";
import { prisma } from "../db/prisma";
import { privateDecrypt } from "crypto";
import { objectIdSchema } from "../validators/user.schema";
import {
  KAFKA_TOPICS,
  UserEvent,
  UserFollowedEvent,
  UserFollowRequestAcceptedEvent,
  UserFollowRequestEvent,
} from "@mta/constants";
import { producer } from "../events/kafka";

export class FollowService {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  private async incrementFollowing(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { followingCount: { increment: 1 } },
    });
  }

  private async decrementFollowing(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { followingCount: { decrement: 1 } },
    });
  }

  private async incrementFollowers(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { followersCount: { increment: 1 } },
    });
  }

  private async decrementFollowers(userId: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { followersCount: { decrement: 1 } },
    });
  }

  async followUser(followerId: string, followingId: string) {
    if (!followerId || !followingId) {
      throw new BadRequestError(
        "User Ids required to create following relationship"
      );
    }

    objectIdSchema.parse(followingId);

    if (followerId === followingId) {
      throw new BadRequestError("You cannot follow yourself.");
    }

    const followingUser = await prisma.user.findUnique({
      where: { id: followingId },
      select: { id: true, isPrivate: true },
    });

    if (!followingUser) {
      throw new NotFoundError("User to follow not found.");
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    if (existingFollow) {
      if (existingFollow.status === "PENDING") {
        throw new BadRequestError("Follow request is already pending.");
      }
      if (existingFollow.status === "ACCEPTED") {
        throw new BadRequestError("You are already following this user.");
      }
    }

    let newStatus = "ACCEPTED";
    let message = "User followed successfully.";

    if (followingUser.isPrivate) {
      newStatus = "PENDING";
      message = "Follow request sent.";
    }

    await this.incrementFollowing(followerId);
    await this.incrementFollowers(followingId);

    const follow = await prisma.follow.create({
      data: {
        followerId: followerId,
        followingId: followingId,
        status: newStatus as any,
      },
      select: { id: true, status: true, followerId: true, followingId: true },
    });

    // fire follow event
    if (follow.status === "PENDING") {
      const p: Omit<
        UserFollowRequestEvent,
        "eventId" | "timestamp" | "version"
      > = {
        eventType: KAFKA_TOPICS.USER.FOLLOW_REQUESTED,
        payload: {
          followerId: followerId,
          followedUserId: followingId,
          followedAt: Date.now(),
        },
      };
      await producer.publish<UserEvent>(KAFKA_TOPICS.USER.FOLLOW_REQUESTED, p);
    } else if (follow.status === "ACCEPTED") {
      const p: Omit<UserFollowedEvent, "eventId" | "timestamp" | "version"> = {
        eventType: KAFKA_TOPICS.USER.FOLLOWED,
        payload: {
          followerId: followerId,
          followedUserId: followingId,
          followedAt: Date.now(),
        },
      };
      await producer.publish<UserEvent>(KAFKA_TOPICS.USER.FOLLOWED, p);
    }
    return { follow, message };
  }

  async unFollowUser(followerId: string, followingId: string) {
    if (!followerId || !followingId) {
      throw new BadRequestError("User Ids required to create unfollow a user");
    }
    objectIdSchema.parse(followingId);
    if (followerId === followingId) {
      throw new BadRequestError("You cannot unfollow yourself.");
    }

    const followToDelete = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: followerId,
          followingId: followingId,
        },
      },
    });

    if (!followToDelete) {
      throw new NotFoundError(
        "No active or pending follow relationship found."
      );
    }

    const message =
      followToDelete.status === "PENDING"
        ? "Follow request cancelled."
        : "Successfully unfollowed user.";

    await this.decrementFollowing(followerId);
    await this.decrementFollowers(followingId);

    await prisma.follow.delete({
      where: {
        id: followToDelete.id,
      },
    });

    return { message };
  }

  async acceptFollowRequest(ownerId: string, requesterId: string) {
    if (!ownerId || !requesterId) {
      throw new BadRequestError("User IDs must be provided in the request");
    }

    objectIdSchema.parse(requesterId);
    const pendingRequest = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: requesterId,
          followingId: ownerId,
        },
      },
    });

    if (!pendingRequest) {
      throw new NotFoundError("No pending follow request from this user.");
    }

    if (pendingRequest.status !== "PENDING") {
      throw new BadRequestError(
        "This request is not pending (already accepted or not a request)."
      );
    }

    const acceptedFollow = await prisma.follow.update({
      where: {
        id: pendingRequest.id,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    await this.incrementFollowing(requesterId);
    await this.incrementFollowers(ownerId);

    // fire event
    const p: Omit<
      UserFollowRequestAcceptedEvent,
      "eventId" | "timestamp" | "version"
    > = {
      eventType: KAFKA_TOPICS.USER.FOLLOW_REQUEST_ACCEPTED,
      payload: {
        followerId: requesterId,
        followedUserId: ownerId,
        followedAt: Date.now(),
      },
    };

    await producer.publish<UserEvent>(
      KAFKA_TOPICS.USER.FOLLOW_REQUEST_ACCEPTED,
      p
    );

    return { acceptedFollow, message: "Follow request accepted." };
  }

  async rejectFollowRequest(ownerId: string, requesterId: string) {
    if (!ownerId || !requesterId) {
      throw new BadRequestError("User IDs must be provided in the request");
    }
    objectIdSchema.parse(requesterId);
    const request = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: requesterId,
          followingId: ownerId,
        },
      },
    });

    if (!request) {
      throw new NotFoundError("No pending follow request from this user.");
    }

    if (request.status !== "PENDING") {
      throw new BadRequestError(
        "This request is not pending (already accepted or not a request)."
      );
    }

    const rejected = await prisma.follow.update({
      where: {
        id: request.id,
      },
      data: {
        status: "REJECTED",
      },
    });

    return { rejected, message: "Follow request rejected." };
  }

  async getFollowers(id: string) {
    if (!id) {
      throw new BadRequestError(
        "User ID must be provided to complete this request."
      );
    }

    objectIdSchema.parse(id);

    const followers = await prisma.follow.findMany({
      where: { followingId: id, status: "ACCEPTED" },
    });

    if (!followers) {
      throw new NotFoundError("This user has no followers");
    }

    return { message: "Followers fetched successfully", followers };
  }

  async getFollowing(id: string) {
    if (!id) {
      throw new BadRequestError(
        "User ID must be provided to complete this request."
      );
    }

    objectIdSchema.parse(id);

    const following = await prisma.follow.findMany({
      where: { followerId: id, status: "ACCEPTED" },
    });

    if (!following) {
      throw new NotFoundError("This user is not following anyone");
    }

    return { message: "following fetched successfully", following };
  }

  async blockUser(blockingUserId: string, blockedUserId: string) {
    if (!blockedUserId || !blockingUserId) {
      throw new BadRequestError(
        "User Ids must be provided to creating a blocking relationship."
      );
    }

    objectIdSchema.parse(blockedUserId);

    const blockedUser = await prisma.user.findUnique({
      where: { id: blockedUserId },
    });

    if (!blockedUser) {
      throw new NotFoundError(
        "This user cannot be blocked because they do not exist."
      );
    }

    const existingBlock = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: blockingUserId,
          blockedId: blockedUser.id,
        },
      },
    });

    if (existingBlock) {
      throw new ConflictError("You have already blocked this user.");
    }

    const block = await prisma.block.create({
      data: {
        blockedId: blockedUserId,
        blockerId: blockingUserId,
      },
    });

    return { block, message: "User has been blocked." };
  }

  async unblockUser(blockingUserId: string, blockedUserId: string) {
    if (!blockedUserId || !blockingUserId) {
      throw new BadRequestError(
        "User Ids must be provided to creating a blocking relationship."
      );
    }

    objectIdSchema.parse(blockedUserId);

    const unblockedUser = await prisma.user.findUnique({
      where: { id: blockedUserId },
    });

    if (!unblockedUser) {
      throw new NotFoundError(
        "This user cannot be blocked because they do not exist."
      );
    }

    const existingUnblock = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: blockingUserId,
          blockedId: unblockedUser.id,
        },
      },
    });

    if (!existingUnblock) {
      throw new NotFoundError("You are not blocking this user");
    }

    const unblock = await prisma.block.delete({
      where: {
        blockerId_blockedId: {
          blockerId: blockingUserId,
          blockedId: blockedUserId,
        },
      },
    });

    return { unblock, message: "User has been blocked." };
  }

  async muteUser(muter: string, mutee: string) {
    if (!muter || !mutee) {
      throw new BadRequestError(
        "User IDs must be provided to create a muting relationship."
      );
    }

    objectIdSchema.parse(mutee);

    if (muter === mutee) {
      throw new BadRequestError("You cannot mute yourself.");
    }

    const mutedUser = await prisma.user.findUnique({
      where: { id: mutee },
    });

    if (!mutedUser) {
      throw new NotFoundError(
        "The user you are trying to mute does not exist."
      );
    }

    const existingMute = await prisma.mute.findUnique({
      where: {
        muterId_mutedId: {
          muterId: muter,
          mutedId: mutee,
        },
      },
    });

    if (existingMute) {
      throw new ConflictError("You have already muted this user.");
    }

    const mute = await prisma.mute.create({
      data: {
        mutedId: mutee,
        muterId: muter,
      },
    });

    return {
      mute,
      message: `${mutedUser.displayName} has been muted successfully.`,
    };
  }

  async unmuteUser(muter: string, mutee: string) {
    if (!muter || !mutee) {
      throw new BadRequestError("User IDs must be provided to unmute a user.");
    }

    objectIdSchema.parse(mutee);

    if (mutee === muter) {
      throw new BadRequestError("You cannot unmute yourself");
    }

    const mutedUser = await prisma.user.findUnique({ where: { id: mutee } });

    if (!mutedUser) {
      throw new NotFoundError("User not found to unmute");
    }

    const existingMute = await prisma.mute.findUnique({
      where: {
        muterId_mutedId: {
          muterId: muter,
          mutedId: mutee,
        },
      },
    });

    if (!existingMute) {
      throw new NotFoundError("You are not currently muting this user.");
    }

    const unmute = await prisma.mute.delete({
      where: {
        muterId_mutedId: {
          muterId: muter,
          mutedId: mutee,
        },
      },
    });

    return {
      unmute,
      message: `${mutedUser.displayName} has been unmuted successfully.`,
    };
  }
}
