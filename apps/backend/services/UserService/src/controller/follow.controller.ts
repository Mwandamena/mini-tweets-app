import { ApiResponse, asyncHandler } from "@mta/common";
import { Request, Response } from "express";
import { FollowService } from "../services/follow.service";

export class FollowController {
  private followService: FollowService;
  constructor() {
    this.followService = new FollowService();
  }

  follow = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const followerId = req.user.id;

    const { follow, message } = await this.followService.followUser(
      followerId,
      id as string,
    );

    return res
      .status(201)
      .json(ApiResponse.success(res, { follow: follow }, message));
  });

  unfollow = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { message } = await this.followService.unFollowUser(
      userId,
      id as string,
    );
    return res.status(200).json(ApiResponse.success(res, {}, message));
  });

  accept = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    const { acceptedFollow, message } =
      await this.followService.acceptFollowRequest(userId, id as string);

    return res
      .status(200)
      .json(
        ApiResponse.success(res, { acceptedFollow: acceptedFollow }, message),
      );
  });

  reject = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    const { message, rejected } = await this.followService.rejectFollowRequest(
      userId,
      id as string,
    );

    return ApiResponse.success(res, { rejected }, message);
  });

  getFollowers = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { followers, message } = await this.followService.getFollowers(
      id as string,
    );
    return ApiResponse.success(res, { followers }, message);
  });

  getFollowing = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { following, message } = await this.followService.getFollowing(
      id as string,
    );
    ApiResponse.success(res, { following }, message);
  });

  block = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { id } = req.params;
    const { block, message } = await this.followService.blockUser(
      userId,
      id as string,
    );

    return ApiResponse.created(res, { block }, message);
  });

  unblock = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { id } = req.params;

    const { unblock, message } = await this.followService.unblockUser(
      userId,
      id as string,
    );

    return ApiResponse.created(res, { unblock }, message);
  });

  mute = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { id } = req.params;

    const { message, mute } = await this.followService.muteUser(
      userId,
      id as string,
    );

    ApiResponse.created(res, { mute }, message);
  });

  unMute = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { id } = req.params;

    const { message, unmute } = await this.followService.unmuteUser(
      userId,
      id as string,
    );

    ApiResponse.created(res, { unmute }, message);
  });
}
