import { optionalAuthenticate } from "@mta/common";
import { Router } from "express";
import { HashtagController } from "../controller/hashtag.controller";

const hashtagRouter = Router();
const hashtagController = new HashtagController();

// ROUTES
hashtagRouter.get("/h/:name", optionalAuthenticate, hashtagController.get);
hashtagRouter.get(
  "/h/trending",
  optionalAuthenticate,
  hashtagController.trending
);

export { hashtagRouter };
