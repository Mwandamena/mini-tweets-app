import { authenticate } from "@mta/common";
import { Router } from "express";
import { TimelineController } from "../controller/timeline.controller";

const timelineRouter = Router();
const timelineController = new TimelineController();

// routes
timelineRouter.get(
  "/t/me/following",
  authenticate,
  timelineController.following
);
timelineRouter.get("/t/me/home", authenticate, timelineController.home);

timelineRouter.get("/t/me/communities/:name", authenticate);
timelineRouter.get("/t/trending/:country", authenticate);
timelineRouter.get("/t/trending", authenticate);

export { timelineRouter };
