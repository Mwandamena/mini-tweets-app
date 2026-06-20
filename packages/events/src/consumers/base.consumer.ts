import { Consumer, EachMessagePayload } from "kafkajs";
import { getLogger } from "@mta/logger";

const logger = getLogger("@mta/events-consumer", "info");

export type EventHandler<T = any> = (event: T) => Promise<void>;

export abstract class BaseConsumer {
  protected abstract readonly topics: string[];
  protected abstract readonly groupId: string;
  protected consumer: Consumer;
  private handlers: Map<string, EventHandler[]> = new Map();
  private isRunning: boolean = false;

  constructor(consumer: Consumer) {
    this.consumer = consumer;
  }

  on<T>(eventType: string, handler: EventHandler<T>): this {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler as EventHandler);
    logger.info(`[${this.groupId}] Registered handler for: ${eventType}`);
    return this;
  }

  registerHandlers(handlers: Record<string, EventHandler>): this {
    Object.entries(handlers).forEach(([eventType, handler]) => {
      this.on(eventType, handler);
    });
    return this;
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn(`[${this.groupId}] Consumer already running`);
      return;
    }

    try {
      await this.consumer.connect();
      logger.info(`[${this.groupId}] Consumer connected`);

      for (const topic of this.topics) {
        await this.consumer.subscribe({ topic, fromBeginning: false });
        logger.info(`[${this.groupId}] Subscribed to: ${topic}`);
      }

      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.processMessage(payload);
        },
      });

      this.isRunning = true;
      logger.info(`[${this.groupId}] Consumer started successfully`);
      logger.info(
        `[${this.groupId}] Registered handlers: ${this.getRegisteredEvents().join(", ")}`
      );
    } catch (error) {
      logger.error(`[${this.groupId}] Failed to start consumer:`, error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    try {
      await this.consumer.disconnect();
      this.isRunning = false;
      logger.info(`[${this.groupId}] Consumer stopped`);
    } catch (error) {
      logger.error(`[${this.groupId}] Failed to stop consumer:`, error);
      throw error;
    }
  }

  private async processMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const offset = message.offset;

    try {
      const event = JSON.parse(message.value?.toString() || "{}");
      const eventType = event.eventType;

      logger.info(
        `[${this.groupId}] Processing: ${eventType} (topic: ${topic}, partition: ${partition}, offset: ${offset})`
      );

      const handlers = this.handlers.get(eventType);

      if (handlers && handlers.length > 0) {
        await Promise.all(
          handlers.map((handler) =>
            handler(event).catch((error) => {
              logger.error(
                `[${this.groupId}] Handler error for ${eventType} (offset: ${offset}):`,
                error
              );

              throw error;
            })
          )
        );

        logger.info(
          `[${this.groupId}] Successfully processed: ${eventType} (offset: ${offset})`
        );
      } else {
        logger.warn(
          `[${this.groupId}] No handler for: ${eventType} (offset: ${offset})`
        );

        await this.handleUnregisteredEvent(event, topic);
      }
    } catch (error) {
      logger.error(
        `[${this.groupId}] Error processing message (topic: ${topic}, partition: ${partition}, offset: ${offset}):`,
        error
      );
      throw error;
    }
  }

  protected async handleUnregisteredEvent(
    event: any,
    topic: string
  ): Promise<void> {}

  getRegisteredEvents(): string[] {
    return Array.from(this.handlers.keys());
  }

  isConsumerRunning(): boolean {
    return this.isRunning;
  }
}
