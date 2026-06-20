import { KafkaEventBus, UserEvent } from "@mta/events";
import { config } from "../config";
import { KAFKA_TOPICS } from "@mta/constants";
import logger from "../config/logger";

console.log("KAFKA_BROKER:", config.KAFKA_BROKER);
export const eventBus = new KafkaEventBus({
  clientId: "auth-service",
  brokers: config.KAFKA_BROKER.split(",") || ["localhost:9093"],
});

export const producer = eventBus.getProducer();

export const authConsumer = eventBus.createAuthConsumer();

authConsumer.on(KAFKA_TOPICS.AUTH.USER_REGISTERED, async (event: UserEvent) => {
  logger.info(`Auth: Creating credentials for user ${event.payload.userId}`);
});
authConsumer.on(KAFKA_TOPICS.AUTH.EMAIL_VERIFIED, async (event: UserEvent) => {
  logger.info(`Auth: Revoking tokens for user ${event.payload.userId}`);
});
authConsumer.on(
  KAFKA_TOPICS.AUTH.PASSWORD_CHANGED,
  async (event: UserEvent) => {
    logger.info(`Auth: Suspending user sessions ${event.payload.userId}`);
  },
);
authConsumer.on(KAFKA_TOPICS.AUTH.PASSWORD_CHANGED, async (event: any) => {
  logger.info(`Auth: Password changed ${event.payload.userId}`);
});

// 2fa events
