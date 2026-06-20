export interface BaseKafkaEvent {
  eventId: string;
  eventType: string;
  timestamp: number;
  version: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export type AuthEvent = any;
export type UserEvent = any;
export type TweetEvent = any;
export type NotificationEvent = any;
export type MessageEvent = any;
export type MediaEvent = any;
export type SearchEvent = any;
export type TimelineEvent = any;
export type ListEvent = any;
export type SpaceEvent = any;
export type ModerationEvent = any;
export type AnalyticsEvent = any;
