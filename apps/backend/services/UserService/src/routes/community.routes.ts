import { authenticate, optionalAuthenticate } from "@mta/common";
import { Router } from "express";
import { CommunityController } from "../controller/community.controller";

const communityRouter = Router();
const communityController = new CommunityController();

// routes
communityRouter.post("/communities", authenticate, communityController.create);
communityRouter.get(
  "/communities/:name",
  optionalAuthenticate,
  communityController.get
);

communityRouter.put(
  "/communities/:name",
  authenticate,
  communityController.edit
);

communityRouter.post(
  "/communities/:name/join",
  authenticate,
  communityController.join
);
communityRouter.delete(
  "/communities/:name/leave",
  authenticate,
  communityController.leave
);

communityRouter.put(
  "/communities/:name/members/:id/approve",
  authenticate,
  communityController.approve
);

communityRouter.post(
  "/communities/:name/ban/:id",
  authenticate,
  communityController.ban
);
communityRouter.post(
  "/communities/:name/unban/:id",
  authenticate,
  communityController.unban
);

communityRouter.post(
  "/communities/:name/moderators/add/:id",
  authenticate,
  communityController.moderator
);
communityRouter.post("/communities/:name/moderators/remove/:id", authenticate);

export { communityRouter };
