export interface BaseEvent {
  eventId: string;
  eventType: string;
  timestamp: string;
  version: string;
}

export enum UserEventType {
  USER_CREATED = "user.created",
  USER_UPDATED = "user.updated",
  USER_DELETED = "user.deleted",
  USER_SUSPENDED = "user.suspended",
}

export interface UserCreatedEventData {
  userId: string;
  email: string;
  username: string;
  displayName: string;
}

export interface UserCreatedEvent extends BaseEvent {
  eventType: UserEventType.USER_CREATED;
  data: UserCreatedEventData;
}

export interface UserUpdatedEventData {
  userId: string;
  updates: {
    email?: string;
    username?: string;
    displayName?: string;
    bio?: string;
  };
}

export interface UserUpdatedEvent extends BaseEvent {
  eventType: UserEventType.USER_UPDATED;
  data: UserUpdatedEventData;
}
