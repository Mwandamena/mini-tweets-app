import { Consumer } from "kafkajs";
import { BaseConsumer } from "./base.consumer";
import { KAFKA_TOPICS } from "../topics/topics";

export class AuthServiceConsumer extends BaseConsumer {
  protected readonly topics = [
    KAFKA_TOPICS.USER.CREATED,
    KAFKA_TOPICS.USER.DELETED,
    KAFKA_TOPICS.USER.SUSPENDED,
    KAFKA_TOPICS.AUTH.PASSWORD_CHANGED,
  ];
  protected readonly groupId = "auth-service-group";

  constructor(consumer: Consumer) {
    super(consumer);
  }
}

export class UserServiceConsumer extends BaseConsumer {
  protected readonly topics = [
    KAFKA_TOPICS.AUTH.USER_REGISTERED,
    KAFKA_TOPICS.AUTH.EMAIL_VERIFIED,
    KAFKA_TOPICS.TWEET.CREATED,
    KAFKA_TOPICS.TWEET.DELETED,
    KAFKA_TOPICS.USER.FOLLOWED,
    KAFKA_TOPICS.USER.UNFOLLOWED,
    KAFKA_TOPICS.MODERATION.ACTION_TAKEN,
  ];
  protected readonly groupId = "user-service-group";

  constructor(consumer: Consumer) {
    super(consumer);
  }
}

export class TweetServiceConsumer extends BaseConsumer {
  protected readonly topics = [
    KAFKA_TOPICS.USER.DELETED,
    KAFKA_TOPICS.USER.SUSPENDED,
    KAFKA_TOPICS.MEDIA.PROCESSED,
    KAFKA_TOPICS.MEDIA.FAILED,
    KAFKA_TOPICS.MODERATION.ACTION_TAKEN,
  ];
  protected readonly groupId = "tweet-service-group";

  constructor(consumer: Consumer) {
    super(consumer);
  }
}

export class NotificationServiceConsumer extends BaseConsumer {
  protected readonly topics = [
    KAFKA_TOPICS.USER.FOLLOWED,
    KAFKA_TOPICS.TWEET.LIKED,
    KAFKA_TOPICS.TWEET.RETWEETED,
    KAFKA_TOPICS.TWEET.REPLIED,
    KAFKA_TOPICS.TWEET.QUOTED,
    KAFKA_TOPICS.MESSAGE.SENT,
    KAFKA_TOPICS.AUTH.EMAIL_VERIFICATION_REQUESTED,
    KAFKA_TOPICS.AUTH.PASSWORD_RESET_REQUESTED,
    KAFKA_TOPICS.AUTH.OTP_REQUESTED,
    KAFKA_TOPICS.LIST.MEMBER_ADDED,
    KAFKA_TOPICS.SPACE.STARTED,
  ];
  protected readonly groupId = "notification-service-group";

  constructor(consumer: Consumer) {
    super(consumer);
  }
}

export class MessageServiceConsumer extends BaseConsumer {
  protected readonly topics = [
    KAFKA_TOPICS.USER.DELETED,
    KAFKA_TOPICS.USER.BLOCKED,
    KAFKA_TOPICS.MEDIA.PROCESSED,
  ];
  protected readonly groupId = "message-service-group";

  constructor(consumer: Consumer) {
    super(consumer);
  }
}

export class MediaServiceConsumer extends BaseConsumer {
  protected readonly topics = [
    KAFKA_TOPICS.USER.DELETED,
    KAFKA_TOPICS.TWEET.DELETED,
    KAFKA_TOPICS.MESSAGE.DELETED,
  ];
  protected readonly groupId = "media-service-group";

  constructor(consumer: Consumer) {
    super(consumer);
  }
}

export class SearchServiceConsumer extends BaseConsumer {
  protected readonly topics = [
    KAFKA_TOPICS.USER.CREATED,
    KAFKA_TOPICS.USER.UPDATED,
    KAFKA_TOPICS.USER.DELETED,
    KAFKA_TOPICS.TWEET.CREATED,
    KAFKA_TOPICS.TWEET.UPDATED,
    KAFKA_TOPICS.TWEET.DELETED,
    KAFKA_TOPICS.TWEET.LIKED,
    KAFKA_TOPICS.TWEET.RETWEETED,
    KAFKA_TOPICS.TWEET.REPLIED,
  ];
  protected readonly groupId = "search-service-group";

  constructor(consumer: Consumer) {
    super(consumer);
  }
}

export class TimelineServiceConsumer extends BaseConsumer {
  protected readonly topics = [
    KAFKA_TOPICS.TWEET.CREATED,
    KAFKA_TOPICS.TWEET.DELETED,
    KAFKA_TOPICS.TWEET.RETWEETED,
    KAFKA_TOPICS.USER.FOLLOWED,
    KAFKA_TOPICS.USER.UNFOLLOWED,
    KAFKA_TOPICS.USER.BLOCKED,
    KAFKA_TOPICS.USER.MUTED,
  ];
  protected readonly groupId = "timeline-service-group";

  constructor(consumer: Consumer) {
    super(consumer);
  }
}

export class ListServiceConsumer extends BaseConsumer {
  protected readonly topics = [
    KAFKA_TOPICS.USER.DELETED,
    KAFKA_TOPICS.TWEET.CREATED,
    KAFKA_TOPICS.TWEET.DELETED,
  ];
  protected readonly groupId = "list-service-group";

  constructor(consumer: Consumer) {
    super(consumer);
  }
}

export class AnalyticsServiceConsumer extends BaseConsumer {
  protected readonly topics = [
    KAFKA_TOPICS.TWEET.CREATED,
    KAFKA_TOPICS.TWEET.LIKED,
    KAFKA_TOPICS.TWEET.RETWEETED,
    KAFKA_TOPICS.TWEET.REPLIED,
    KAFKA_TOPICS.TWEET.VIEWED,
    KAFKA_TOPICS.USER.FOLLOWED,
    KAFKA_TOPICS.USER.PROFILE_VIEWED,
    KAFKA_TOPICS.SEARCH.QUERY_PERFORMED,
    KAFKA_TOPICS.MESSAGE.SENT,
  ];
  protected readonly groupId = "analytics-service-group";

  constructor(consumer: Consumer) {
    super(consumer);
  }
}

export class ModerationServiceConsumer extends BaseConsumer {
  protected readonly topics = [
    KAFKA_TOPICS.TWEET.CREATED,
    KAFKA_TOPICS.MESSAGE.SENT,
    KAFKA_TOPICS.USER.CREATED,
    KAFKA_TOPICS.MODERATION.CONTENT_REPORTED,
    KAFKA_TOPICS.MODERATION.USER_REPORTED,
  ];
  protected readonly groupId = "moderation-service-group";

  constructor(consumer: Consumer) {
    super(consumer);
  }
}
