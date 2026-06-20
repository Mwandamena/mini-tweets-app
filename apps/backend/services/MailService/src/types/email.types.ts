export type EmailTemplate =
  | "welcome"
  | "email-verification"
  | "password-reset"
  | "password-changed"
  | "new-follower"
  | "tweet-liked"
  | "tweet-retweeted"
  | "tweet-replied"
  | "tweet-quoted"
  | "new-message"
  | "account-suspended"
  | "weekly-digest";

export interface EmailData {
  to: string;
  subject: string;
  template: EmailTemplate;
  context: Record<string, any>;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
