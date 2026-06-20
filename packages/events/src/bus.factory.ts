import { Kafka } from "kafkajs";
import * as Consumers from "./consumers/service.consumers";
import { KafkaProducer } from "./producers/base.producer";

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  sasl?: {
    mechanism: "plain" | "scram-sha-256" | "scram-sha-512";
    username: string;
    password: string;
  };
  connectionTimeout?: number;
  initialRetryTime?: number;
  requestTimeout?: number;
}

export class KafkaEventBus {
  private kafka: Kafka;
  private producer: KafkaProducer;

  constructor(config: KafkaConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      ssl: config.ssl,
      connectionTimeout: config.connectionTimeout || 30000,
      requestTimeout: config.requestTimeout || 30000,
      retry: {
        initialRetryTime: config.initialRetryTime || 300,
      },
    });

    this.producer = new KafkaProducer(this.kafka);
  }

  async connect(): Promise<void> {
    await this.producer.connect();
  }

  async disconnect(): Promise<void> {
    await this.producer.disconnect();
  }

  getProducer(): KafkaProducer {
    return this.producer;
  }

  // Consumer factory methods
  createAuthConsumer(): Consumers.AuthServiceConsumer {
    const consumer = this.kafka.consumer({ groupId: "auth-service-group" });
    return new Consumers.AuthServiceConsumer(consumer);
  }

  createUserConsumer(): Consumers.UserServiceConsumer {
    const consumer = this.kafka.consumer({ groupId: "user-service-group" });
    return new Consumers.UserServiceConsumer(consumer);
  }

  createTweetConsumer(): Consumers.TweetServiceConsumer {
    const consumer = this.kafka.consumer({ groupId: "tweet-service-group" });
    return new Consumers.TweetServiceConsumer(consumer);
  }

  createNotificationConsumer(): Consumers.NotificationServiceConsumer {
    const consumer = this.kafka.consumer({
      groupId: "notification-service-group",
    });
    return new Consumers.NotificationServiceConsumer(consumer);
  }

  createMessageConsumer(): Consumers.MessageServiceConsumer {
    const consumer = this.kafka.consumer({ groupId: "message-service-group" });
    return new Consumers.MessageServiceConsumer(consumer);
  }

  createMediaConsumer(): Consumers.MediaServiceConsumer {
    const consumer = this.kafka.consumer({ groupId: "media-service-group" });
    return new Consumers.MediaServiceConsumer(consumer);
  }

  createSearchConsumer(): Consumers.SearchServiceConsumer {
    const consumer = this.kafka.consumer({ groupId: "search-service-group" });
    return new Consumers.SearchServiceConsumer(consumer);
  }

  createTimelineConsumer(): Consumers.TimelineServiceConsumer {
    const consumer = this.kafka.consumer({ groupId: "timeline-service-group" });
    return new Consumers.TimelineServiceConsumer(consumer);
  }

  createListConsumer(): Consumers.ListServiceConsumer {
    const consumer = this.kafka.consumer({ groupId: "list-service-group" });
    return new Consumers.ListServiceConsumer(consumer);
  }

  createAnalyticsConsumer(): Consumers.AnalyticsServiceConsumer {
    const consumer = this.kafka.consumer({
      groupId: "analytics-service-group",
    });
    return new Consumers.AnalyticsServiceConsumer(consumer);
  }

  createModerationConsumer(): Consumers.ModerationServiceConsumer {
    const consumer = this.kafka.consumer({
      groupId: "moderation-service-group",
    });
    return new Consumers.ModerationServiceConsumer(consumer);
  }
}
