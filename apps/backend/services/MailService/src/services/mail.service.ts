import nodemailer, { Transporter } from "nodemailer";
import { promises as fs } from "fs";
import path from "path";
import handlebars from "handlebars";
import { getLogger } from "@mta/logger";
import { emailConfig } from "../config/email.config";
import juice from "juice";
import {
  EmailData,
  EmailTemplate,
  SendEmailResult,
} from "../types/email.types";

const logger = getLogger("@mta/email-service", "info");

export class EmailService {
  private transporter: Transporter;
  private templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();
  private templatesDir: string;

  constructor(templatesDir?: string) {
    this.templatesDir = templatesDir || path.join(__dirname, "../templates");
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    });

    this.registerHelpers();
  }

  private registerHelpers(): void {
    handlebars.registerHelper("formatDate", (date: Date | number | string) => {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    });

    handlebars.registerHelper("formatTime", (date: Date | number | string) => {
      const d = new Date(date);
      return d.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    handlebars.registerHelper("truncate", (text: string, length: number) => {
      if (!text) return "";
      return text.length > length ? text.substring(0, length) + "..." : text;
    });

    handlebars.registerHelper("capitalize", (text: string) => {
      if (!text) return "";
      return text.charAt(0).toUpperCase() + text.slice(1);
    });
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info("Email service connection verified");
      return true;
    } catch (error) {
      logger.error("Email service connection failed:", error);
      return false;
    }
  }

  private async loadTemplate(
    templateName: EmailTemplate
  ): Promise<HandlebarsTemplateDelegate> {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
      const templateSource = await fs.readFile(templatePath, "utf-8");
      const template = handlebars.compile(templateSource);

      this.templateCache.set(templateName, template);

      return template;
    } catch (error) {
      logger.error(`Failed to load template: ${templateName}`, error);
      throw new Error(`Template not found: ${templateName}`);
    }
  }

  async sendEmail(emailData: EmailData): Promise<SendEmailResult> {
    try {
      const template = await this.loadTemplate(emailData.template);
      let html = template(emailData.context);
      html = juice(html);
      const info = await this.transporter.sendMail({
        from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
        to: emailData.to,
        subject: emailData.subject,
        html,
      });

      logger.info(
        `Email sent successfully: ${info.messageId}: ${emailData.to}`
      );

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      logger.error("Failed to send email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async sendWelcomeEmail(
    to: string,
    username: string
  ): Promise<SendEmailResult> {
    return this.sendEmail({
      to,
      subject: "Welcome to Mini-tweets Application! 🎉",
      template: "welcome",
      context: {
        username,
        year: new Date().getFullYear(),
        appUrl: process.env.APP_URL || "https://localhost:5173",
      },
    });
  }

  async sendEmailVerification(
    to: string,
    username: string,
    verificationToken: string
  ): Promise<SendEmailResult> {
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;

    return this.sendEmail({
      to,
      subject: "Verify your email address",
      template: "email-verification",
      context: {
        username,
        verificationUrl,
        expiresIn: "24 hours",
        year: new Date().getFullYear(),
      },
    });
  }

  async sendPasswordReset(
    to: string,
    username: string,
    resetToken: string
  ): Promise<SendEmailResult> {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    return this.sendEmail({
      to,
      subject: "Reset your password",
      template: "password-reset",
      context: {
        username,
        resetUrl,
        expiresIn: "1 hour",
        year: new Date().getFullYear(),
      },
    });
  }

  async sendPasswordChanged(
    to: string,
    username: string
  ): Promise<SendEmailResult> {
    return this.sendEmail({
      to,
      subject: "Your password was changed",
      template: "password-changed",
      context: {
        username,
        changeDate: new Date(),
        supportUrl: `${process.env.APP_URL}/support`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendNewFollowerNotification(
    to: string,
    username: string,
    followerUsername: string,
    followerDisplayName: string,
    followerAvatar?: string
  ): Promise<SendEmailResult> {
    return this.sendEmail({
      to,
      subject: `${followerDisplayName} started following you`,
      template: "new-follower",
      context: {
        username,
        followerUsername,
        followerDisplayName,
        followerAvatar:
          followerAvatar || `${process.env.APP_URL}/default-avatar.png`,
        profileUrl: `${process.env.APP_URL}/${followerUsername}`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendTweetLikedNotification(
    to: string,
    username: string,
    likerUsername: string,
    likerDisplayName: string,
    tweetContent: string,
    tweetId: string
  ): Promise<SendEmailResult> {
    return this.sendEmail({
      to,
      subject: `${likerDisplayName} liked your tweet`,
      template: "tweet-liked",
      context: {
        username,
        likerUsername,
        likerDisplayName,
        tweetContent: tweetContent.substring(0, 140),
        tweetUrl: `${process.env.APP_URL}/tweet/${tweetId}`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendTweetRetweetedNotification(
    to: string,
    username: string,
    retweeterUsername: string,
    retweeterDisplayName: string,
    tweetContent: string,
    tweetId: string
  ): Promise<SendEmailResult> {
    return this.sendEmail({
      to,
      subject: `${retweeterDisplayName} retweeted your tweet`,
      template: "tweet-retweeted",
      context: {
        username,
        retweeterUsername,
        retweeterDisplayName,
        tweetContent: tweetContent.substring(0, 140),
        tweetUrl: `${process.env.APP_URL}/tweet/${tweetId}`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendTweetRepliedNotification(
    to: string,
    username: string,
    replierUsername: string,
    replierDisplayName: string,
    replyContent: string,
    tweetId: string
  ): Promise<SendEmailResult> {
    return this.sendEmail({
      to,
      subject: `${replierDisplayName} replied to your tweet`,
      template: "tweet-replied",
      context: {
        username,
        replierUsername,
        replierDisplayName,
        replyContent: replyContent.substring(0, 140),
        tweetUrl: `${process.env.APP_URL}/tweet/${tweetId}`,
        year: new Date().getFullYear(),
      },
    });
  }

  /**
   * Send new message notification
   */
  async sendNewMessageNotification(
    to: string,
    username: string,
    senderUsername: string,
    senderDisplayName: string,
    messagePreview: string
  ): Promise<SendEmailResult> {
    return this.sendEmail({
      to,
      subject: `New message from ${senderDisplayName}`,
      template: "new-message",
      context: {
        username,
        senderUsername,
        senderDisplayName,
        messagePreview: messagePreview.substring(0, 100),
        messagesUrl: `${process.env.APP_URL}/messages`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendAccountSuspended(
    to: string,
    username: string,
    reason: string,
    suspensionEndsAt?: Date
  ): Promise<SendEmailResult> {
    return this.sendEmail({
      to,
      subject: "Your account has been suspended",
      template: "account-suspended",
      context: {
        username,
        reason,
        suspensionEndsAt,
        isTemporary: !!suspensionEndsAt,
        appealUrl: `${process.env.APP_URL}/appeal`,
        year: new Date().getFullYear(),
      },
    });
  }

  async sendWeeklyDigest(
    to: string,
    username: string,
    stats: {
      newFollowers: number;
      tweetLikes: number;
      tweetRetweets: number;
      profileViews: number;
    },
    topTweets: Array<{ content: string; likes: number; id: string }>
  ): Promise<SendEmailResult> {
    return this.sendEmail({
      to,
      subject: "Your weekly summary 📊",
      template: "weekly-digest",
      context: {
        username,
        stats,
        topTweets,
        appUrl: process.env.APP_URL,
        year: new Date().getFullYear(),
      },
    });
  }

  clearCache(): void {
    this.templateCache.clear();
    logger.info("Email template cache cleared");
  }
}
