import { authenticate } from "@mta/common";
import { Router } from "express";

const notificationRouter = Router();

// routes
notificationRouter.get("/me/settings/notifications", authenticate);
notificationRouter.patch("/me/settings/notifications", authenticate);
notificationRouter.get("/:profileId/views", authenticate);

export { notificationRouter };
