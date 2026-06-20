import {
  Kafka,
  Partitioners,
  Producer,
  ProducerRecord,
  RecordMetadata,
} from "kafkajs";
import { getLogger } from "@mta/logger";
import { randomUUID } from "crypto";
import { BaseKafkaEvent } from "../types/types";

const logger = getLogger("@mta/events-producer", "info");

export class KafkaProducer {
  private producer: Producer;
  private isConnected: boolean = false;

  constructor(kafka: Kafka) {
    this.producer = kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner,
      allowAutoTopicCreation: true,
      transactionTimeout: 30000,
      maxInFlightRequests: 5,
      idempotent: true,
    });
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      logger.warn("Producer already connected");
      return;
    }

    try {
      await this.producer.connect();
      this.isConnected = true;
      logger.info("Kafka producer connected");
    } catch (error) {
      logger.error("Failed to connect producer:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.producer.disconnect();
      this.isConnected = false;
      logger.info("Kafka producer disconnected");
    } catch (error) {
      logger.error("Failed to disconnect producer:", error);
      throw error;
    }
  }

  async publish<T extends BaseKafkaEvent>(
    topic: string,
    event: Omit<T, "eventId" | "timestamp" | "version">
  ): Promise<RecordMetadata[]> {
    this.ensureConnected();

    const enrichedEvent: T = {
      ...event,
      eventId: randomUUID(),
      timestamp: Date.now(),
      version: "1.0",
    } as T;

    try {
      const record: ProducerRecord = {
        topic,
        messages: [
          {
            key: enrichedEvent.eventId,
            value: JSON.stringify(enrichedEvent),
            headers: {
              eventType: enrichedEvent.eventType,
              correlationId: enrichedEvent.correlationId || "",
              timestamp: enrichedEvent.timestamp.toString(),
            },
          },
        ],
      };

      const result = await this.producer.send(record);

      logger.info(
        `Published event: ${enrichedEvent.eventType} to ${topic} (id: ${enrichedEvent.eventId})`
      );

      return result;
    } catch (error) {
      logger.error(`Failed to publish event to ${topic}:`, error);
      throw error;
    }
  }

  async publishBatch<T extends BaseKafkaEvent>(
    topic: string,
    events: Array<Omit<T, "eventId" | "timestamp" | "version">>
  ): Promise<RecordMetadata[]> {
    this.ensureConnected();

    if (events.length === 0) {
      logger.warn("Attempted to publish empty batch");
      return [];
    }

    try {
      const messages = events.map((event) => {
        const enrichedEvent: T = {
          ...event,
          eventId: randomUUID(),
          timestamp: Date.now(),
          version: "1.0",
        } as T;

        return {
          key: enrichedEvent.eventId,
          value: JSON.stringify(enrichedEvent),
          headers: {
            eventType: enrichedEvent.eventType,
            correlationId: enrichedEvent.correlationId || "",
            timestamp: enrichedEvent.timestamp.toString(),
          },
        };
      });

      const result = await this.producer.send({
        topic,
        messages,
      });

      logger.info(`Published ${events.length} events to ${topic}`);

      return result;
    } catch (error) {
      logger.error(`Failed to publish batch to ${topic}:`, error);
      throw error;
    }
  }

  private ensureConnected(): void {
    if (!this.isConnected) {
      throw new Error("Producer not connected. Call connect() first.");
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}
