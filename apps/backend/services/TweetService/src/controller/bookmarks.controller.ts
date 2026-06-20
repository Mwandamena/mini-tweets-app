import { ApiResponse, asyncHandler } from "@mta/common";
import { Request, Response } from "express";
import { BookmarksService } from "../services/bookmark.service";

export class BookmarkController {
  private bookmarksService: BookmarksService;
  constructor() {
    this.bookmarksService = new BookmarksService();
  }

  create = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { tweetId } = req.params;

    const { bookmark, message } = await this.bookmarksService.createBookmark(
      tweetId as string,
      userId,
    );

    return ApiResponse.created(res, bookmark, message);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { tweetId } = req.params;

    const { message } = await this.bookmarksService.deleteBookmark(
      tweetId as string,
      userId,
    );

    return ApiResponse.success(res, message);
  });

  getBookmarks = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { page, limit } = req.query;

    const { tweets, meta } = await this.bookmarksService.getBookmarks(userId);

    return ApiResponse.paginated(
      res,
      tweets,
      meta.page,
      meta.limit,
      meta.total,
    );
  });
}
