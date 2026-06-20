import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  ForbiddenError,
} from "@mta/common";
import { prisma } from "../db/prisma";
import {
  CommunityCreateInput,
  communityCreateSchema,
  CommunityUpdateInput,
} from "../validators/community.schema";

export class CommunityService {
  constructor() {}
  private async getCommunityByName(name: string) {
    const community = await prisma.community.findUnique({
      where: { name },
      include: {
        owner: true,
        members: true,
        bannedMembers: true,
        moderators: true,
      },
    });

    if (!community) {
      throw new NotFoundError("Community not found.");
    }
    return community;
  }

  async createCommnity(userId: string, data: CommunityCreateInput) {
    if (!userId) {
      throw new BadRequestError(
        "User ID must be provided to create a community."
      );
    }

    communityCreateSchema.parse(data);

    const existingCommunity = await prisma.community.findUnique({
      where: { name: data.name },
    });

    if (existingCommunity) {
      throw new ConflictError(
        `Community name '${data.name}' is already taken.`
      );
    }

    const community = await prisma.community.create({
      data: {
        ...data,
        ownerId: userId,
        members: {
          create: {
            userId: userId,
            status: "ACTIVE",
          },
        },
        memberCount: 1,
      },
    });

    return { community, message: "Community created successfully." };
  }

  async getCommunity(name: string, currentUserId?: string) {
    if (!name) {
      throw new BadRequestError("Community name must be provided.");
    }

    const community = await this.getCommunityByName(name);

    const isMember = community.members.some(
      (m) => m.userId === currentUserId && m.status === "ACTIVE"
    );

    const isOwnerOrModerator =
      community.ownerId === currentUserId ||
      community.moderators.some((m) => m.userId === currentUserId);

    if (community.isPrivate && !isMember && !isOwnerOrModerator) {
      throw new ForbiddenError(
        "You are not authorized to view this private community."
      );
    }

    return { community, message: "Community fetched successfully." };
  }

  async editCommunity(
    name: string,
    userId: string,
    data: CommunityUpdateInput
  ) {
    if (!name) {
      throw new BadRequestError("Community name must be provided.");
    }

    const community = await this.getCommunityByName(name);

    const isModerator = community.moderators.some((m) => m.userId === userId);

    if (community.ownerId !== userId && !isModerator) {
      throw new ForbiddenError(
        "You must be the community owner or a moderator to edit this community."
      );
    }

    const updatedCommunity = await prisma.community.update({
      where: { name: name },
      data: data,
    });

    return { updatedCommunity, message: "Community updated successfully." };
  }

  async joinCommunity(name: string, userId: string) {
    if (!name || !userId) {
      throw new BadRequestError("Community name and user ID must be provided.");
    }

    const community = await this.getCommunityByName(name);

    const isBanned = community.bannedMembers.some((b) => b.userId === userId);
    if (isBanned) {
      throw new ForbiddenError(
        "You are banned from this community and cannot join."
      );
    }

    const existingMember = community.members.find((m) => m.userId === userId);
    if (existingMember && existingMember.status === "ACTIVE") {
      throw new ConflictError(
        "You are already an active member of this community."
      );
    }

    if (existingMember && existingMember.status === "PENDING") {
      throw new ConflictError("Your membership request is already pending.");
    }

    const status = community.requireApproval ? "PENDING" : "ACTIVE";

    let member;
    if (existingMember) {
      member = await prisma.communityMember.update({
        where: { id: existingMember.id },
        data: { status: status as any, joinedAt: new Date() },
      });
    } else {
      member = await prisma.communityMember.create({
        data: {
          userId: userId,
          communityId: community.id,
          status: status as any,
        },
      });
      if (status === "ACTIVE") {
        await prisma.community.update({
          where: { id: community.id },
          data: { memberCount: { increment: 1 } },
        });
      }
    }

    const message =
      status === "PENDING"
        ? "Membership request submitted for approval."
        : "Successfully joined community.";

    return { member, message };
  }

  async leaveCommunity(name: string, userId: string) {
    if (!name || !userId) {
      throw new BadRequestError("Community name and user ID must be provided.");
    }

    const community = await this.getCommunityByName(name);

    if (community.ownerId === userId) {
      throw new ForbiddenError(
        "The owner cannot leave the community. They must first transfer ownership or delete the community."
      );
    }

    const memberRecord = community.members.find(
      (m) => m.userId === userId && m.status === "ACTIVE"
    );

    if (!memberRecord) {
      throw new NotFoundError(
        "You are not an active member of this community."
      );
    }

    await prisma.communityMember.delete({
      where: { id: memberRecord.id },
    });

    await prisma.community.update({
      where: { id: community.id },
      data: { memberCount: { decrement: 1 } },
    });

    return { message: "Successfully left the community." };
  }

  async approveCommunityRequest(
    name: string,
    moderatorId: string,
    requesterId: string
  ) {
    if (!name || !moderatorId || !requesterId) {
      throw new BadRequestError(
        "Community name, moderator ID, and requester ID must be provided."
      );
    }

    const community = await this.getCommunityByName(name);
    const isModerator = community.moderators.some(
      (m) => m.userId === moderatorId
    );
    if (community.ownerId !== moderatorId && !isModerator) {
      throw new ForbiddenError(
        "You must be the community owner or a moderator to approve requests."
      );
    }

    const pendingRecord = community.members.find(
      (m) => m.userId === requesterId && m.status === "PENDING"
    );

    if (!pendingRecord) {
      throw new NotFoundError("No pending request found from this user.");
    }

    const approvedMember = await prisma.communityMember.update({
      where: { id: pendingRecord.id },
      data: { status: "ACTIVE" },
    });

    await prisma.community.update({
      where: { id: community.id },
      data: { memberCount: { increment: 1 } },
    });

    return { approvedMember, message: "Membership request approved." };
  }

  async banFromCommunity(
    name: string,
    moderatorId: string,
    targetUserId: string
  ) {
    if (!name || !moderatorId || !targetUserId) {
      throw new BadRequestError("All required IDs must be provided.");
    }

    const community = await this.getCommunityByName(name);

    if (targetUserId === community.ownerId) {
      throw new ForbiddenError("You cannot ban the community owner.");
    }
    if (targetUserId === moderatorId) {
      throw new ForbiddenError("You cannot ban yourself.");
    }
    const isModerator = community.moderators.some(
      (m) => m.userId === moderatorId
    );
    if (community.ownerId !== moderatorId && !isModerator) {
      throw new ForbiddenError(
        "You must be the community owner or a moderator to ban members."
      );
    }

    const existingBan = community.bannedMembers.some(
      (b) => b.userId === targetUserId
    );
    if (existingBan) {
      throw new ConflictError("This user is already banned.");
    }

    const memberRecord = community.members.find(
      (m) => m.userId === targetUserId && m.status === "ACTIVE"
    );
    if (memberRecord) {
      await prisma.communityMember.delete({ where: { id: memberRecord.id } });
      await prisma.community.update({
        where: { id: community.id },
        data: { memberCount: { decrement: 1 } },
      });
    }

    const ban = await prisma.communityBan.create({
      data: {
        userId: targetUserId,
        communityId: community.id,
        bannedBy: moderatorId,
        reason: "Banned by moderator/owner.",
      },
    });

    return { ban, message: "User has been banned from the community." };
  }

  async addModeratorToCommunity(
    name: string,
    ownerId: string,
    targetUserId: string
  ) {
    if (!name || !ownerId || !targetUserId) {
      throw new BadRequestError("All required IDs must be provided.");
    }

    const community = await this.getCommunityByName(name);

    if (community.ownerId !== ownerId) {
      throw new ForbiddenError(
        "Only the community owner can manage moderators."
      );
    }

    if (targetUserId === community.ownerId) {
      throw new ConflictError("The owner is inherently a moderator.");
    }
    const existingModerator = community.moderators.some(
      (m) => m.userId === targetUserId
    );
    if (existingModerator) {
      throw new ConflictError("This user is already a moderator.");
    }

    const moderator = await prisma.communityModerator.create({
      data: {
        userId: targetUserId,
        communityId: community.id,
        permissions: ["MANAGE_POSTS", "MANAGE_MEMBERS"] as any,
      },
    });

    return { moderator, message: "User promoted to community moderator." };
  }
}
