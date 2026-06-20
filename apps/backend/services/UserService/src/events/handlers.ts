import logger from "../config/logger";
import { prisma } from "../db/prisma";

export class UserServiceEventHandler {
  constructor() {}

  async registerUser(data: {
    userId: string;
    email: string;
    username: string;
  }) {
    const user = await prisma.user.create({
      data: {
        id: data.userId,
        email: data.email,
        displayName: data.username.split(" ")[1] || data.username,
        username: data.username,
      },
      select: {
        email: true,
        username: true,
      },
    });
    logger.info(`User created with email ${user.email}`);
  }
}
