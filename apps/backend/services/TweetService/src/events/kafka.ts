import {
  KafkaEventBus,
  KAFKA_TOPICS,
  UserEvent,
  MediaEvent,
} from "@mta/events";

export const eventBus = new KafkaEventBus({
  clientId: "tweet-service",
  brokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9093"],
});

export const producer = eventBus.getProducer();
export const tweetConsumer = eventBus.createTweetConsumer();

tweetConsumer
  .on(KAFKA_TOPICS.USER.DELETED, async (event: UserEvent) => {
    console.log("Tweet: User deleted, cleaning up", event.payload.userId);
    // Delete or anonymize all user tweets
  })
  .on(KAFKA_TOPICS.USER.SUSPENDED, async (event: UserEvent) => {
    console.log("Tweet: User suspended, hiding tweets", event.payload.userId);
    // hide all user tweets
  })
  .on(KAFKA_TOPICS.MEDIA.PROCESSED, async (event: MediaEvent) => {
    console.log("Tweet: Media processed", event.payload.mediaId);
    // update tweet media
  })
  .on(KAFKA_TOPICS.MEDIA.FAILED, async (event: MediaEvent) => {
    console.log("Tweet: Media failed", event.payload.mediaId);
    // mark media as failed
  });
