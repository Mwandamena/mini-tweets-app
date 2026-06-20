// ==================== Kafka Topics by Service ====================

export const KAFKA_TOPICS = {
  // Auth Service Topics
  AUTH: {
    USER_REGISTERED: "auth.user.registered",
    USER_LOGIN: "auth.user.login",
    USER_LOGOUT: "auth.user.logout",
    OTP_REQUESTED: "auth.otp.requested",
    OTP_VERIFIED: "auth.otp.verified",
    EMAIL_VERIFICATION_REQUESTED: "auth.email_verification.requested",
    EMAIL_VERIFIED: "auth.email.verified",
    PASSWORD_CHANGED: "auth.password.changed",
    EMAIL_CHANGE_REQUESTED: "auth.email_change.requested",
    EMAIL_CHANGED: "auth.email.changed",
    PASSWORD_RESET_REQUESTED: "auth.password_reset.requested",
    PASSWORD_RESET_COMPLETED: "auth.password_reset.completed",
    TWO_FA_ENABLED: "auth.2fa.enabled",
    TWO_FA_DISABLED: "auth.2fa.disabled",
    TWO_FA_VERIFIED: "auth.2fa.verified",
    REFRESH_TOKEN_ISSUED: "auth.refresh_token.issued",
    REFRESH_TOKEN_REVOKED: "auth.refresh_token.revoked",
    SESSION_EXPIRED: "auth.session.expired",
  },

  // User Service Topics
  USER: {
    CREATED: "user.created",
    UPDATED: "user.updated",
    DELETED: "user.deleted",
    SUSPENDED: "user.suspended",
    ACTIVATED: "user.activated",
    FOLLOWED: "user.followed",
    FOLLOW_REQUESTED: "user.follow.requested",
    FOLLOW_REQUEST_ACCEPTED: "user.follow.request.accepted",
    UNFOLLOWED: "user.unfollowed",
    BLOCKED: "user.blocked",
    UNBLOCKED: "user.unblocked",
    MUTED: "user.muted",
    UNMUTED: "user.unmuted",
    PROFILE_VIEWED: "user.profile.viewed",
    VERIFIED_BADGE_GRANTED: "user.verified_badge.granted",
    VERIFIED_BADGE_REVOKED: "user.verified_badge.revoked",
  },

  // Tweet Service Topics
  TWEET: {
    CREATED: "tweet.created",
    UPDATED: "tweet.updated",
    DELETED: "tweet.deleted",
    LIKED: "tweet.liked",
    UNLIKED: "tweet.unliked",
    MENTIONED: "tweet.mentioned",
    RETWEETED: "tweet.retweeted",
    UNRETWEETED: "tweet.unretweeted",
    REPLIED: "tweet.replied",
    QUOTED: "tweet.quoted",
    BOOKMARKED: "tweet.bookmarked",
    UNBOOKMARKED: "tweet.unbookmarked",
    VIEWED: "tweet.viewed",
    SHARED: "tweet.shared",
  },

  // Notification Service Topics
  NOTIFICATION: {
    EMAIL_SEND: "notification.email.send",
    EMAIL_SENT: "notification.email.sent",
    EMAIL_FAILED: "notification.email.failed",
    PUSH_SEND: "notification.push.send",
    PUSH_SENT: "notification.push.sent",
    PUSH_FAILED: "notification.push.failed",
    SMS_SEND: "notification.sms.send",
    SMS_SENT: "notification.sms.sent",
    SMS_FAILED: "notification.sms.failed",
    CREATED: "notification.created",
    READ: "notification.read",
    DELETED: "notification.deleted",
  },

  // Message Service Topics (DMs)
  MESSAGE: {
    SENT: "message.sent",
    DELIVERED: "message.delivered",
    READ: "message.read",
    DELETED: "message.deleted",
    UPDATED: "message.updated",
    CONVERSATION_CREATED: "message.conversation.created",
    CONVERSATION_DELETED: "message.conversation.deleted",
    TYPING_STARTED: "message.typing.started",
    TYPING_STOPPED: "message.typing.stopped",
    PARTICIPANT_ADDED: "message.participant.added",
    PARTICIPANT_REMOVED: "message.participant.removed",
  },

  // Media Service Topics
  MEDIA: {
    UPLOADED: "media.uploaded",
    PROCESSING: "media.processing",
    PROCESSED: "media.processed",
    FAILED: "media.failed",
    DELETED: "media.deleted",
  },

  // Search Service Topics
  SEARCH: {
    QUERY_PERFORMED: "search.query.performed",
    TRENDING_UPDATED: "search.trending.updated",
    INDEX_UPDATED: "search.index.updated",
  },

  // Timeline/Feed Service Topics
  TIMELINE: {
    UPDATED: "timeline.updated",
    CACHE_INVALIDATED: "timeline.cache.invalidated",
  },

  // List Service Topics
  LIST: {
    CREATED: "list.created",
    UPDATED: "list.updated",
    DELETED: "list.deleted",
    MEMBER_ADDED: "list.member.added",
    MEMBER_REMOVED: "list.member.removed",
    FOLLOWED: "list.followed",
    UNFOLLOWED: "list.unfollowed",
  },

  SPACE: {
    CREATED: "space.created",
    STARTED: "space.started",
    ENDED: "space.ended",
    UPDATED: "space.updated",
    SPEAKER_JOINED: "space.speaker.joined",
    SPEAKER_LEFT: "space.speaker.left",
    LISTENER_JOINED: "space.listener.joined",
    LISTENER_LEFT: "space.listener.left",
    RECORDING_STARTED: "space.recording.started",
    RECORDING_STOPPED: "space.recording.stopped",
  },

  MODERATION: {
    CONTENT_REPORTED: "moderation.content.reported",
    USER_REPORTED: "moderation.user.reported",
    REPORT_REVIEWED: "moderation.report.reviewed",
    ACTION_TAKEN: "moderation.action.taken",
    CONTENT_FLAGGED: "moderation.content.flagged",
    APPEAL_SUBMITTED: "moderation.appeal.submitted",
  },

  ANALYTICS: {
    EVENT_TRACKED: "analytics.event.tracked",
    IMPRESSION_RECORDED: "analytics.impression.recorded",
    ENGAGEMENT_RECORDED: "analytics.engagement.recorded",
  },
} as const;

export interface BaseKafkaEvent {
  eventId: string;
  eventType: string;
  timestamp: number;
  version: string;
  correlationId?: string;
  metadata?: Record<string, any>;
}

export interface UserRegisteredEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.USER_REGISTERED;
  payload: {
    userId: string;
    username: string;
    email: string;
    registeredAt: number;
    registrationMethod: "email" | "google" | "apple" | "phone";
    ipAddress?: string;
    userAgent?: string;
  };
}

export interface UserLoginEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.USER_LOGIN;
  payload: {
    userId: string;
    sessionId: string;
    email: string;
    loginMethod: "password" | "otp" | "oauth" | "2fa";
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    loginAt: number;
  };
}

export interface OTPRequestedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.OTP_REQUESTED;
  payload: {
    userId: string;
    phoneNumber?: string;
    email?: string;
    otpType: "login" | "verification" | "password_reset";
    expiresAt: number;
    requestedAt: number;
  };
}

export interface OTPVerifiedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.OTP_VERIFIED;
  payload: {
    userId: string;
    otpType: "login" | "verification" | "password_reset";
    verifiedAt: number;
  };
}

export interface EmailVerificationRequestedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.EMAIL_VERIFICATION_REQUESTED;
  payload: {
    userId: string;
    email: string;
    verificationToken: string;
    expiresAt: number;
    requestedAt: number;
  };
}

export interface EmailVerifiedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.EMAIL_VERIFIED;
  payload: {
    userId: string;
    email: string;
    verifiedAt: number;
  };
}

export interface EmailChangedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.EMAIL_CHANGED;
  payload: {
    userId: string;
    email: string;
    changedAt: number;
    ipAddress?: string;
    requireReauthentication: boolean;
  };
}

export interface EmailChangeRequestEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.EMAIL_CHANGE_REQUESTED;
  payload: {
    userId: string;
    email: string;
    verificationToken: string;
    expiresAt: number;
    requestedAt: number;
  };
}

export interface PasswordChangedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.PASSWORD_CHANGED;
  payload: {
    userId: string;
    email: string;
    changedAt: number;
    ipAddress?: string;
    requireReauthentication: boolean;
  };
}

export interface PasswordResetRequestedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.PASSWORD_RESET_REQUESTED;
  payload: {
    userId: string;
    email: string;
    resetToken: string;
    expiresAt: number;
    requestedAt: number;
  };
}

export interface TwoFAEnabledEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.TWO_FA_ENABLED;
  payload: {
    userId: string;
    email: string;
    method: "totp" | "sms" | "email";
    enabledAt: number;
  };
}

export interface TwoFADisabledEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.TWO_FA_DISABLED;
  payload: {
    userId: string;
    email: string;
    disabledAt: number;
  };
}

export interface RefreshTokenIssuedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.REFRESH_TOKEN_ISSUED;
  payload: {
    userId: string;
    tokenId: string;
    expiresAt: number;
    issuedAt: number;
  };
}

export interface SessionExpiredEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.AUTH.SESSION_EXPIRED;
  payload: {
    userId: string;
    sessionId: string;
    reason: "timeout" | "logout" | "security" | "password_changed";
    expiredAt: number;
  };
}

export interface UserCreatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.CREATED;
  payload: {
    userId: string;
    username: string;
    email: string;
    displayName: string;
    profileImageUrl?: string;
    createdAt: number;
  };
}

export interface UserUpdatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.UPDATED;
  payload: {
    userId: string;
    updatedFields: {
      username?: string;
      displayName?: string;
      bio?: string;
      location?: string;
      website?: string;
      profileImageUrl?: string;
      bannerImageUrl?: string;
      birthDate?: string;
    };
    updatedAt: number;
  };
}

export interface UserDeletedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.DELETED;
  payload: {
    userId: string;
    deletedAt: number;
    reason?: string;
    deletedBy?: string;
  };
}

export interface UserSuspendedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.SUSPENDED;
  payload: {
    userId: string;
    suspendedAt: number;
    reason: string;
    suspendedBy: string;
    suspensionEndsAt?: number;
  };
}

export interface UserActivatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.ACTIVATED;
  payload: {
    userId: string;
    activatedAt: number;
    activatedBy?: string;
  };
}

export interface UserFollowedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.FOLLOWED;
  payload: {
    followerId: string;
    followedUserId: string;
    followedAt: number;
  };
}

export interface UserFollowRequestEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.FOLLOW_REQUESTED;
  payload: {
    followerId: string;
    followedUserId: string;
    followedAt: number;
  };
}

export interface UserFollowRequestAcceptedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.FOLLOW_REQUEST_ACCEPTED;
  payload: {
    followerId: string;
    followedUserId: string;
    followedAt: number;
  };
}

export interface UserUnfollowedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.UNFOLLOWED;
  payload: {
    followerId: string;
    unfollowedUserId: string;
    unfollowedAt: number;
  };
}

export interface UserBlockedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.BLOCKED;
  payload: {
    blockerId: string;
    blockedUserId: string;
    blockedAt: number;
  };
}

export interface UserUnblockedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.UNBLOCKED;
  payload: {
    blockerId: string;
    unblockedUserId: string;
    unblockedAt: number;
  };
}

export interface UserMutedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.MUTED;
  payload: {
    muterId: string;
    mutedUserId: string;
    mutedAt: number;
    duration?: number;
  };
}

export interface ProfileViewedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.USER.PROFILE_VIEWED;
  payload: {
    viewerId?: string;
    profileUserId: string;
    viewedAt: number;
    sessionId: string;
  };
}

// ==================== Tweet Service Events ====================

export interface TweetCreatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.CREATED;
  payload: {
    tweetId: string;
    userId: string;
    content: string;
    mediaUrls?: string[];
    mediaIds?: string[];
    replyToTweetId?: string;
    quotedTweetId?: string;
    mentions?: string[];
    hashtags?: string[];
    urls?: string[];
    visibility: "public" | "private" | "followers";
    sensitive: boolean;
    createdAt: number;
  };
}

export interface TweetMentionedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.MENTIONED;
  payload: {
    tweetId: string;
    userId: string;
    mentionedUserId: string[];
    mentionedAt: number;
  };
}

export interface TweetUpdatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.UPDATED;
  payload: {
    tweetId: string;
    userId: string;
    content: string;
    updatedAt: number;
    editHistory: {
      previousContent: string;
      editedAt: number;
    }[];
  };
}

export interface TweetDeletedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.DELETED;
  payload: {
    tweetId: string;
    userId: string;
    deletedAt: number;
    deletedBy?: string;
    reason?: string;
  };
}

export interface TweetLikedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.LIKED;
  payload: {
    tweetId: string;
    email: string;
    username: string;
    authorUsername: string;
    authorDisplayName: string;
    content: string;
    userId: string;
    tweetAuthorId: string;
    likedAt: number;
  };
}

export interface TweetUnlikedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.UNLIKED;
  payload: {
    tweetId: string;
    userId: string;
    unlikedAt: number;
  };
}

export interface TweetRetweetedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.RETWEETED;
  payload: {
    originalTweetId: string;
    retweetId: string;
    userId: string;
    tweetAuthorId: string;
    retweetedAt: number;
  };
}

export interface TweetUnretweetedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.UNRETWEETED;
  payload: {
    originalTweetId: string;
    retweetId: string;
    userId: string;
    unretweetedAt: number;
  };
}

export interface TweetRepliedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.REPLIED;
  payload: {
    replyTweetId: string;
    originalTweetId: string;
    userId: string;
    originalAuthorId: string;
    repliedAt: number;
  };
}

export interface TweetQuotedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.QUOTED;
  payload: {
    quoteTweetId: string;
    quotedTweetId: string;
    userId: string;
    quotedAuthorId: string;
    quotedAt: number;
  };
}

export interface TweetBookmarkedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.BOOKMARKED;
  payload: {
    tweetId: string;
    userId: string;
    bookmarkedAt: number;
  };
}

export interface TweetUnbookmarkedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.UNBOOKMARKED;
  payload: {
    tweetId: string;
    userId: string;
    unbookmarkedAt: number;
  };
}

export interface TweetViewedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.VIEWED;
  payload: {
    tweetId: string;
    userId?: string;
    viewedAt: number;
    sessionId: string;
    viewDurationMs?: number;
  };
}

export interface TweetSharedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TWEET.SHARED;
  payload: {
    tweetId: string;
    userId?: string;
    shareMethod: "copy_link" | "email" | "dm" | "external";
    sharedAt: number;
  };
}

// ==================== Notification Service Events ====================

export interface EmailSendEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.NOTIFICATION.EMAIL_SEND;
  payload: {
    recipientEmail: string;
    recipientUserId: string;
    subject: string;
    templateId: string;
    templateData: Record<string, any>;
    priority: "high" | "normal" | "low";
    scheduledFor?: number;
  };
}

export interface EmailSentEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.NOTIFICATION.EMAIL_SENT;
  payload: {
    emailId: string;
    recipientEmail: string;
    recipientUserId: string;
    subject: string;
    sentAt: number;
    provider: string;
  };
}

export interface EmailFailedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.NOTIFICATION.EMAIL_FAILED;
  payload: {
    emailId: string;
    recipientEmail: string;
    recipientUserId: string;
    error: string;
    failedAt: number;
    retryCount: number;
  };
}

export interface PushSendEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.NOTIFICATION.PUSH_SEND;
  payload: {
    recipientUserId: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    imageUrl?: string;
    actionUrl?: string;
    priority: "high" | "normal";
  };
}

export interface PushSentEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.NOTIFICATION.PUSH_SENT;
  payload: {
    pushId: string;
    recipientUserId: string;
    deviceTokens: string[];
    sentAt: number;
  };
}

export interface SMSSendEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.NOTIFICATION.SMS_SEND;
  payload: {
    recipientPhone: string;
    recipientUserId: string;
    message: string;
    countryCode: string;
  };
}

export interface NotificationCreatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.NOTIFICATION.CREATED;
  payload: {
    notificationId: string;
    userId: string;
    type:
      | "like"
      | "retweet"
      | "reply"
      | "follow"
      | "mention"
      | "quote"
      | "message";
    actorId: string;
    targetId?: string;
    content: string;
    createdAt: number;
  };
}

export interface NotificationReadEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.NOTIFICATION.READ;
  payload: {
    notificationId: string;
    userId: string;
    readAt: number;
  };
}

// ==================== Message Service Events ====================

export interface MessageSentEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MESSAGE.SENT;
  payload: {
    messageId: string;
    conversationId: string;
    senderId: string;
    recipientIds: string[];
    content: string;
    mediaUrls?: string[];
    replyToMessageId?: string;
    sentAt: number;
  };
}

export interface MessageDeliveredEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MESSAGE.DELIVERED;
  payload: {
    messageId: string;
    conversationId: string;
    deliveredTo: string;
    deliveredAt: number;
  };
}

export interface MessageReadEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MESSAGE.READ;
  payload: {
    messageId: string;
    conversationId: string;
    readBy: string;
    readAt: number;
  };
}

export interface MessageDeletedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MESSAGE.DELETED;
  payload: {
    messageId: string;
    conversationId: string;
    deletedBy: string;
    deletedFor: "sender" | "recipient" | "everyone";
    deletedAt: number;
  };
}

export interface ConversationCreatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MESSAGE.CONVERSATION_CREATED;
  payload: {
    conversationId: string;
    participantIds: string[];
    createdBy: string;
    conversationType: "direct" | "group";
    groupName?: string;
    createdAt: number;
  };
}

export interface TypingStartedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MESSAGE.TYPING_STARTED;
  payload: {
    conversationId: string;
    userId: string;
    startedAt: number;
  };
}

export interface TypingStoppedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MESSAGE.TYPING_STOPPED;
  payload: {
    conversationId: string;
    userId: string;
    stoppedAt: number;
  };
}

// ==================== Media Service Events ====================

export interface MediaUploadedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MEDIA.UPLOADED;
  payload: {
    mediaId: string;
    userId: string;
    mediaType: "image" | "video" | "gif";
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: number;
  };
}

export interface MediaProcessingEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MEDIA.PROCESSING;
  payload: {
    mediaId: string;
    status: "started" | "in_progress" | "completed";
    progress?: number;
    processingAt: number;
  };
}

export interface MediaProcessedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MEDIA.PROCESSED;
  payload: {
    mediaId: string;
    originalUrl: string;
    processedUrls: {
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      original?: string;
    };
    metadata: {
      width?: number;
      height?: number;
      duration?: number;
      format?: string;
    };
    processedAt: number;
  };
}

export interface MediaFailedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MEDIA.FAILED;
  payload: {
    mediaId: string;
    userId: string;
    error: string;
    errorCode?: string;
    failedAt: number;
  };
}

export interface MediaDeletedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MEDIA.DELETED;
  payload: {
    mediaId: string;
    userId: string;
    deletedAt: number;
  };
}

// ==================== Search Service Events ====================

export interface SearchQueryPerformedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.SEARCH.QUERY_PERFORMED;
  payload: {
    userId?: string;
    query: string;
    filters?: {
      type?: "users" | "tweets" | "hashtags";
      dateRange?: { from: number; to: number };
      location?: string;
    };
    resultsCount: number;
    performedAt: number;
  };
}

export interface TrendingUpdatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.SEARCH.TRENDING_UPDATED;
  payload: {
    trendingTopics: Array<{
      topic: string;
      tweetCount: number;
      rank: number;
      category?: string;
    }>;
    location?: string;
    updatedAt: number;
  };
}

export interface SearchIndexUpdatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.SEARCH.INDEX_UPDATED;
  payload: {
    entityType: "user" | "tweet" | "hashtag";
    entityId: string;
    operation: "create" | "update" | "delete";
    updatedAt: number;
  };
}

// ==================== Timeline Service Events ====================

export interface TimelineUpdatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TIMELINE.UPDATED;
  payload: {
    userId: string;
    feedType: "home" | "user" | "mentions" | "likes";
    reason: "new_tweet" | "new_follow" | "engagement";
    updatedAt: number;
  };
}

export interface TimelineCacheInvalidatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.TIMELINE.CACHE_INVALIDATED;
  payload: {
    userId: string;
    feedType: "home" | "user" | "mentions" | "likes";
    reason: string;
    invalidatedAt: number;
  };
}

// ==================== List Service Events ====================

export interface ListCreatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.LIST.CREATED;
  payload: {
    listId: string;
    userId: string;
    name: string;
    description?: string;
    isPrivate: boolean;
    createdAt: number;
  };
}

export interface ListUpdatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.LIST.UPDATED;
  payload: {
    listId: string;
    userId: string;
    updatedFields: {
      name?: string;
      description?: string;
      isPrivate?: boolean;
    };
    updatedAt: number;
  };
}

export interface ListMemberAddedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.LIST.MEMBER_ADDED;
  payload: {
    listId: string;
    listOwnerId: string;
    addedUserId: string;
    addedAt: number;
  };
}

export interface ListMemberRemovedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.LIST.MEMBER_REMOVED;
  payload: {
    listId: string;
    listOwnerId: string;
    removedUserId: string;
    removedAt: number;
  };
}

// ==================== Space Service Events ====================

export interface SpaceCreatedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.SPACE.CREATED;
  payload: {
    spaceId: string;
    hostId: string;
    title: string;
    description?: string;
    scheduledStartTime?: number;
    isPublic: boolean;
    createdAt: number;
  };
}

export interface SpaceStartedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.SPACE.STARTED;
  payload: {
    spaceId: string;
    hostId: string;
    startedAt: number;
  };
}

export interface SpaceEndedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.SPACE.ENDED;
  payload: {
    spaceId: string;
    hostId: string;
    duration: number;
    participantCount: number;
    endedAt: number;
  };
}

export interface SpaceSpeakerJoinedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.SPACE.SPEAKER_JOINED;
  payload: {
    spaceId: string;
    userId: string;
    joinedAt: number;
  };
}

export interface SpaceListenerJoinedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.SPACE.LISTENER_JOINED;
  payload: {
    spaceId: string;
    userId?: string;
    joinedAt: number;
  };
}

// ==================== Moderation Service Events ====================

export interface ContentReportedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MODERATION.CONTENT_REPORTED;
  payload: {
    reportId: string;
    contentType: "tweet" | "user" | "message" | "space";
    contentId: string;
    reportedBy: string;
    reason:
      | "spam"
      | "abuse"
      | "hate_speech"
      | "violence"
      | "sensitive_content"
      | "other";
    details?: string;
    reportedAt: number;
  };
}

export interface UserReportedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MODERATION.USER_REPORTED;
  payload: {
    reportId: string;
    reportedUserId: string;
    reportedBy: string;
    reason: "harassment" | "impersonation" | "spam" | "other";
    details?: string;
    reportedAt: number;
  };
}

export interface ModerationActionTakenEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MODERATION.ACTION_TAKEN;
  payload: {
    actionId: string;
    reportId?: string;
    contentType: "tweet" | "user" | "message";
    contentId: string;
    action: "removed" | "warned" | "suspended" | "dismissed" | "shadowban";
    moderatorId: string;
    reason: string;
    actionTakenAt: number;
  };
}

export interface ContentFlaggedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.MODERATION.CONTENT_FLAGGED;
  payload: {
    contentType: "tweet" | "message" | "profile";
    contentId: string;
    flagReason: "nsfw" | "spam" | "hate_speech" | "violence";
    confidence: number;
    flaggedBy: "system" | "moderator";
    flaggedAt: number;
  };
}

// ==================== Analytics Service Events ====================

export interface AnalyticsEventTrackedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.ANALYTICS.EVENT_TRACKED;
  payload: {
    userId?: string;
    sessionId: string;
    eventName: string;
    properties: Record<string, any>;
    trackedAt: number;
  };
}

export interface ImpressionRecordedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.ANALYTICS.IMPRESSION_RECORDED;
  payload: {
    userId?: string;
    contentType: "tweet" | "ad" | "profile" | "space";
    contentId: string;
    impressionId: string;
    recordedAt: number;
  };
}

export interface EngagementRecordedEvent extends BaseKafkaEvent {
  eventType: typeof KAFKA_TOPICS.ANALYTICS.ENGAGEMENT_RECORDED;
  payload: {
    userId: string;
    contentType: "tweet" | "profile";
    contentId: string;
    engagementType:
      | "like"
      | "retweet"
      | "reply"
      | "share"
      | "bookmark"
      | "follow";
    recordedAt: number;
  };
}

// ==================== Union Types by Service ====================

export type AuthEvent =
  | UserRegisteredEvent
  | UserLoginEvent
  | OTPRequestedEvent
  | OTPVerifiedEvent
  | EmailVerificationRequestedEvent
  | EmailVerifiedEvent
  | EmailChangedEvent
  | EmailChangeRequestEvent
  | PasswordChangedEvent
  | PasswordResetRequestedEvent
  | TwoFAEnabledEvent
  | RefreshTokenIssuedEvent
  | SessionExpiredEvent;

export type UserEvent =
  | UserCreatedEvent
  | UserUpdatedEvent
  | UserDeletedEvent
  | UserSuspendedEvent
  | UserActivatedEvent
  | UserFollowedEvent
  | UserFollowRequestEvent
  | UserFollowRequestAcceptedEvent
  | UserUnfollowedEvent
  | UserBlockedEvent
  | UserUnblockedEvent
  | UserMutedEvent
  | ProfileViewedEvent;

export type TweetEvent =
  | TweetCreatedEvent
  | TweetMentionedEvent
  | TweetUpdatedEvent
  | TweetDeletedEvent
  | TweetLikedEvent
  | TweetUnlikedEvent
  | TweetRetweetedEvent
  | TweetUnretweetedEvent
  | TweetRepliedEvent
  | TweetQuotedEvent
  | TweetBookmarkedEvent
  | TweetUnbookmarkedEvent
  | TweetViewedEvent
  | TweetSharedEvent;

export type NotificationEvent =
  | EmailSendEvent
  | EmailSentEvent
  | EmailFailedEvent
  | PushSendEvent
  | PushSentEvent
  | SMSSendEvent
  | NotificationCreatedEvent
  | NotificationReadEvent;

export type MessageEvent =
  | MessageSentEvent
  | MessageDeliveredEvent
  | MessageReadEvent
  | MessageDeletedEvent
  | ConversationCreatedEvent
  | TypingStartedEvent
  | TypingStoppedEvent;

export type MediaEvent =
  | MediaUploadedEvent
  | MediaProcessingEvent
  | MediaProcessedEvent
  | MediaFailedEvent
  | MediaDeletedEvent;

export type SearchEvent =
  | SearchQueryPerformedEvent
  | TrendingUpdatedEvent
  | SearchIndexUpdatedEvent;

export type TimelineEvent =
  | TimelineUpdatedEvent
  | TimelineCacheInvalidatedEvent;

export type ListEvent =
  | ListCreatedEvent
  | ListUpdatedEvent
  | ListMemberAddedEvent
  | ListMemberRemovedEvent;

export type SpaceEvent =
  | SpaceCreatedEvent
  | SpaceStartedEvent
  | SpaceEndedEvent
  | SpaceSpeakerJoinedEvent
  | SpaceListenerJoinedEvent;

export type ModerationEvent =
  | ContentReportedEvent
  | UserReportedEvent
  | ModerationActionTakenEvent
  | ContentFlaggedEvent;

export type AnalyticsEvent =
  | AnalyticsEventTrackedEvent
  | ImpressionRecordedEvent
  | EngagementRecordedEvent;

export type AllKafkaEvents =
  | AuthEvent
  | UserEvent
  | TweetEvent
  | NotificationEvent
  | MessageEvent
  | MediaEvent
  | SearchEvent
  | TimelineEvent
  | ListEvent
  | SpaceEvent
  | ModerationEvent
  | AnalyticsEvent;

// validations
export * from "./validation/auth.schema";
export * from "./validation/user.schema";
export * from "./validation/tweet.schema";
export * from "./validation/media.schema";
export * from "./validation/community.schema";
