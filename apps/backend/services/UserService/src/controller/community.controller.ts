import { ApiResponse, asyncHandler } from "@mta/common";
import { Request, Response } from "express";
import { CommunityService } from "../services/community.service";

export class CommunityController {
  private communityService: CommunityService;
  constructor() {
    this.communityService = new CommunityService();
  }

  // create a commnity
  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const {
      description,
      displayName,
      name,
      rules,
      allowPosts,
      bannerImage,
      isPrivate,
      profileImage,
      requireApproval,
    } = req.body;

    const { community, message } = await this.communityService.createCommnity(
      userId,
      {
        description,
        displayName,
        name,
        rules,
        allowPosts,
        bannerImage,
        isPrivate,
        profileImage,
        requireApproval,
      },
    );

    return ApiResponse.success(res, { community }, message);
  });

  // get a commnity
  get = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.params;
    const userId = req.user.id;
    const { community, message } = await this.communityService.getCommunity(
      name as string,
      userId,
    );

    return ApiResponse.success(res, { community }, message);
  });

  // edit a commnity
  edit = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { name: communityName } = req.params;
    const {
      description,
      displayName,
      name,
      rules,
      allowPosts,
      bannerImage,
      isPrivate,
      profileImage,
      requireApproval,
    } = req.body;
    const { message, updatedCommunity } =
      await this.communityService.editCommunity(
        communityName as string,
        userId,
        {
          description,
          displayName,
          name,
          rules,
          allowPosts,
          bannerImage,
          isPrivate,
          profileImage,
          requireApproval,
        },
      );

    return ApiResponse.success(res, { updatedCommunity }, message);
  });

  // join a commnity
  join = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { name } = req.params;
    const { member, message } = await this.communityService.joinCommunity(
      name as string,
      userId,
    );
    return ApiResponse.success(res, { member }, message);
  });

  // leave a commnity
  leave = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { name } = req.params;
    const { message } = await this.communityService.leaveCommunity(
      name as string,
      userId,
    );
    return ApiResponse.success(res, null, message);
  });

  // approve a commnity
  approve = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { name, id } = req.params;

    const { approvedMember, message } =
      await this.communityService.approveCommunityRequest(
        name as string,
        userId,
        id as string,
      );

    return ApiResponse.success(res, { approvedMember }, message);
  });

  // ban a commnity
  ban = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { name, id } = req.params;

    const { ban, message } = await this.communityService.banFromCommunity(
      name as string,
      userId,
      id as string,
    );
    return ApiResponse.success(res, { ban }, message);
  });

  // unban a commnity
  unban = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { name, id } = req.params;
    return ApiResponse.noContent(res);
  });

  // moderator a commnity
  moderator = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { name, id } = req.params;

    const { message, moderator } =
      await this.communityService.addModeratorToCommunity(
        name as string,
        userId,
        id as string,
      );

    return ApiResponse.success(res, { moderator }, message);
  });
}
