import { authenticate } from "@mta/common";
import { Router } from "express";
import { MediaController } from "../controller/media.controller";

const mediaRouter = Router();
const mediaController = new MediaController();

// routes
mediaRouter.post("/media/upload", authenticate, mediaController.upload);

mediaRouter.delete("/media/upload", authenticate, mediaController.delete);

export { mediaRouter };
