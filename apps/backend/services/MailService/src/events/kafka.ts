import {
  KafkaEventBus,
  KAFKA_TOPICS,
  UserEvent,
  TweetEvent,
  AuthEvent,
} from "@mta/events";
import { logger } from "../config/logger";
import { EmailService } from "../services/mail.service";

const email = new EmailService("../templates");

export const eventBus = new KafkaEventBus({
  clientId: "notification-service",
  brokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"],
});

export const producer = eventBus.getProducer();
export const notificationConsumer = eventBus.createNotificationConsumer();

notificationConsumer
  .on(KAFKA_TOPICS.USER.FOLLOWED, async (event: UserEvent) => {
    logger.info("Notification: Sending follower notification");
  })
  .on(KAFKA_TOPICS.TWEET.LIKED, async (event: TweetEvent) => {
    logger.info("Notification: Sending like notification");
    await email.sendTweetLikedNotification(
      event.email,
      event.username,
      event.authorUsername,
      event.authorDisplayName,
      event.content,
      event.tweetId,
    );
  })
  .on(KAFKA_TOPICS.TWEET.RETWEETED, async (event: TweetEvent) => {
    logger.info("Notification: Sending retweet notification");
  })
  .on(KAFKA_TOPICS.TWEET.REPLIED, async (event: TweetEvent) => {
    logger.info("Notification: Sending reply notification");
  })
  .on(
    KAFKA_TOPICS.AUTH.EMAIL_VERIFICATION_REQUESTED,
    async (event: AuthEvent) => {
      logger.info("Notification: Sending verification email");
    },
  )
  .on(KAFKA_TOPICS.AUTH.OTP_REQUESTED, async (event: AuthEvent) => {
    logger.info("Notification: Sending OTP");
  })
  .on(KAFKA_TOPICS.AUTH.USER_REGISTERED, async (event: AuthEvent) => {
    logger.info("Notification: Sending user registered notification");
    await email.sendWelcomeEmail(event.email, event.username);
  });
