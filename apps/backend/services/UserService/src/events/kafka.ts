import {
  KafkaEventBus,
  AuthEvent,
  TweetEvent,
  UserEvent,
  KAFKA_TOPICS,
} from "@mta/events";

import logger from "../config/logger";
import { UserServiceEventHandler } from "./handlers";

const userServiceEventHandler = new UserServiceEventHandler();

export const eventBus = new KafkaEventBus({
  clientId: "user-service",
  brokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9093"],
});

export const producer = eventBus.getProducer();
export const userConsumer = eventBus.createUserConsumer();

// Register handlers
userConsumer.on(KAFKA_TOPICS.AUTH.USER_REGISTERED, async (event: AuthEvent) => {
  logger.info(`User: Creating profile for user ${event.payload.email}`);
  await userServiceEventHandler.registerUser({
    userId: event.payload.userId,
    email: event.payload.email,
    username: event.payload.username,
  });
});

userConsumer.on(KAFKA_TOPICS.AUTH.EMAIL_VERIFIED, async (event: AuthEvent) => {
  logger.info(`User: Email verified for user ${event.payload.email}`);
});
userConsumer.on(KAFKA_TOPICS.TWEET.CREATED, async (event: TweetEvent) => {
  logger.info(`User: Incrementing tweet count for user ${event.payload.email}`);
});
userConsumer.on(KAFKA_TOPICS.TWEET.DELETED, async (event: TweetEvent) => {
  logger.info(`User: Decrementing tweet count for user ${event.payload.email}`);
});
userConsumer.on(KAFKA_TOPICS.USER.FOLLOWED, async (event: UserEvent) => {
  logger.info(`User: Updating follower counts for user ${event.payload.email}`);
});
userConsumer.on(KAFKA_TOPICS.USER.UNFOLLOWED, async (event: UserEvent) => {
  logger.info(`User: Updating follower counts for user ${event.payload.email}`);
});
