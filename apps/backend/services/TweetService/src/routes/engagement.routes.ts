import { authenticate, optionalAuthenticate } from "@mta/common";
import { Router } from "express";
import { EngagementController } from "../controller/engagement.controller";

const engagementRouter = Router();
const engagementController = new EngagementController();

// ROUTES
engagementRouter.post(
  "/e/like/:tweetId",
  authenticate,
  engagementController.like
);
engagementRouter.delete(
  "/e/like/:tweetId",
  authenticate,
  engagementController.unlike
);

engagementRouter.post(
  "/e/retweet/:tweetId",
  authenticate,
  engagementController.retweet
);
engagementRouter.delete(
  "/e/retweet/:tweetId",
  authenticate,
  engagementController.unretweet
);

// get current user likes, retweets and mentions
engagementRouter.get(
  "/e/me/likes",
  authenticate,
  engagementController.getCurrentUserLikes
);
engagementRouter.get(
  "/e/me/retweets",
  authenticate,
  engagementController.getCurrentUserRetweets
);
engagementRouter.get(
  "/e/me/mentions",
  authenticate,
  engagementController.getCurrentUserMentions
);

// get engagement user details
engagementRouter.get(
  "/e/:userId/likes",
  optionalAuthenticate,
  engagementController.getUserLikes
);
engagementRouter.get(
  "/e/:userId/retweets",
  optionalAuthenticate,
  engagementController.getUserRetweets
);
engagementRouter.get(
  "/e/:userId/mentions",
  optionalAuthenticate,
  engagementController.getUserMentions
);

export { engagementRouter };
