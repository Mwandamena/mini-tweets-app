import express from "express";
import { UserController } from "../controller/user.controller";
import { authenticate, serviceAuthentication } from "@mta/common";

const userRouter = express.Router();
const userController = new UserController();

// define user routes here
userRouter.get("/me", authenticate, userController.getCurrentUser);

userRouter.get("/me/followers", authenticate, userController.getUserFollowers);
userRouter.get("/me/following", authenticate, userController.getUserFollowing);

userRouter.get("/all/:id", userController.getSingleUser);

userRouter.get("/all", authenticate, userController.getAllUsers);

userRouter.put("/edit/:id", authenticate, userController.editUser);

// bulk user exits
userRouter.post("/batch/id", serviceAuthentication, userController.batchExists);

// bulk get users by username
userRouter.post(
  "/batch/username",
  serviceAuthentication,
  userController.batchGetUsersByUsername
);

export { userRouter };
