import express from "express";
import { FollowController } from "../controller/follow.controller";
import { authenticate } from "@mta/common";

const followRouter = express.Router();
const followController = new FollowController();

followRouter.post("/follow/:id", authenticate, followController.follow);
followRouter.delete("/unfollow/:id", authenticate, followController.unfollow);
followRouter.put("/follow/accept/:id", authenticate, followController.accept);
followRouter.delete(
  "/follow/reject/:id",
  authenticate,
  followController.reject
);

followRouter.get("/followers/:id", authenticate, followController.getFollowers);
followRouter.get("/following/:id", authenticate, followController.getFollowing);

followRouter.post("/block/:id", authenticate, followController.block);
followRouter.delete("/unblock/:id", authenticate, followController.unblock);
followRouter.post("/mute/:id", authenticate, followController.mute);
followRouter.delete("/unmute/:id", authenticate, followController.unMute);

export { followRouter };
