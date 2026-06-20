import { authenticate } from "@mta/common";
import { Router } from "express";
import { BookmarkController } from "../controller/bookmarks.controller";

const bookmarksRouter = Router();
const bookmarkController = new BookmarkController();

// ROUTES
bookmarksRouter.post("/b/:tweetId/", authenticate, bookmarkController.create);
bookmarksRouter.delete("/b/:tweetId/", authenticate, bookmarkController.delete);

bookmarksRouter.get("/b/me/", authenticate, bookmarkController.getBookmarks);

export { bookmarksRouter };
