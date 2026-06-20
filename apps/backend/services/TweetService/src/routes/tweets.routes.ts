import { authenticate, optionalAuthenticate } from "@mta/common";
import { Router } from "express";
import { TweetController } from "../controller/tweets.controller";

const tweetsRouter = Router();
const tweetsController = new TweetController();

// routes
tweetsRouter.post("/t/create", authenticate, tweetsController.create);
tweetsRouter.post("/t/reply/:tweetId", authenticate, tweetsController.reply);

tweetsRouter.delete(
  "/t/delete/:tweetId",
  authenticate,
  tweetsController.delete
);
tweetsRouter.put("/t/edit/:tweetId", authenticate, tweetsController.edit);

tweetsRouter.get("/t/:tweetId", optionalAuthenticate, tweetsController.get);

tweetsRouter.get(
  "/t/me/tweets",
  optionalAuthenticate,
  tweetsController.getUserTweets
);

tweetsRouter.get(
  "/t/me/replies",
  optionalAuthenticate,
  tweetsController.getUserReplies
);

// user tweets
tweetsRouter.get(
  "/t/user/:userId/tweets",
  optionalAuthenticate,
  tweetsController.getUserTweetsByUserId
);

// user replies
tweetsRouter.get(
  "/t/user/:userId/replies",
  optionalAuthenticate,
  tweetsController.getUserRepliesByUserId
);

export { tweetsRouter };
