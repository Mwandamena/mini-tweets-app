import { asyncHandler, ApiResponse } from "@mta/common";
import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  /* GET CURRENT USER */
  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;

    const { user } = await this.userService.currentUser(userId);

    return ApiResponse.success(
      res,
      user,
      "User information fetched successfully",
    );
  });

  /* GET SINGLE USER */
  getSingleUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { user } = await this.userService.singleUser(id as string);
    return ApiResponse.success(res, { ...user }, "User fetched successfully");
  });

  // get all users
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const { users } = await this.userService.allUsers();
    return ApiResponse.paginated(
      res,
      users,
      1,
      10,
      users.length,
      "Users fetched successfully",
    );
  });

  // edit user
  editUser = asyncHandler(async (req: Request, res: Response) => {
    const currentUserId = req.user.id;
    const { id } = req.params;
    const {
      displayName,
      username,
      bio,
      location,
      website,
      profileImage,
      bannerImage,
      dateOfBirth,
      isPrivate,
    } = req.body;

    const { updatedUser } = await this.userService.editUser(
      id as string,
      currentUserId,
      {
        username,
        profileImage,
        bio,
        location,
        website,
        bannerImage,
        dateOfBirth,
        isPrivate,
        displayName,
      },
    );

    return ApiResponse.success(
      res,
      updatedUser,
      "Your details have been updated successfully",
    );
  });

  // get user followers
  getUserFollowers = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { followers, message } = await this.userService.userFollowers(userId);
    return ApiResponse.success(res, followers, message);
  });

  // get user following
  getUserFollowing = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { following, message } = await this.userService.userFollowing(userId);
    return ApiResponse.success(res, following, message);
  });

  batchExists = asyncHandler(async (req: Request, res: Response) => {
    const { userIds } = req.body;
    const { users } = await this.userService.batchExists(userIds);
    return ApiResponse.success(res, users, "Users fetched successfully");
  });

  batchGetUsersByUsername = asyncHandler(
    async (req: Request, res: Response) => {
      const { usernames } = req.body;
      const { users } = await this.userService.getUsersByUsername(usernames);
      return ApiResponse.success(res, users, "Users fetched successfully");
    },
  );
}
