import { BaseEvent } from "./user.events";

export enum TweetEventType {
  TWEET_CREATED = "tweet.created",
  TWEET_LIKED = "tweet.liked",
  TWEET_RETWEETED = "tweet.retweeted",
}

export interface TweetCreatedEventData {
  tweetId: string;
  authorId: string;
  content: string;
  hashtags?: string[];
  mentions?: string[];
}

export interface TweetCreatedEvent extends BaseEvent {
  eventType: TweetEventType.TWEET_CREATED;
  data: TweetCreatedEventData;
}
