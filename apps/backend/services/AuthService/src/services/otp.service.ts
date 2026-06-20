import { Response } from "express";
import { ValidationError, NotFoundError, BadRequestError } from "@mta/common";
import { emailOTP, OTPSchema, phoneOTP } from "../validators/auth.schema";
import { prisma } from "../db/prisma";
import { RedisHelper } from "../common/utils/redis.helpers";
import { genNumeric } from "../common/utils/auth/otp.utils";
import logger from "../config/logger";
import { LoginService } from "./login.service";
import {
  AuthEvent,
  KAFKA_TOPICS,
  OTPRequestedEvent,
  OTPVerifiedEvent,
} from "@mta/constants";
import { producer } from "../events";

interface LoginOTP {
  email?: string;
  phone?: string;
}

interface VerifyLoginOTP extends LoginOTP {
  code: string;
}

export class OTPLoginService {
  private readonly OTP_EXPIRY_SECONDS = 5 * 60;
  private readonly OTP_KEY_PREFIX = "otp:login:";
  private readonly OTP_VERIFICATION_KEY_PREFIX = "otp:verify:";
  private readonly RATE_LIMIT_KEY_PREFIX = "otp:ratelimit:";
  private readonly ATTEMPTS_KEY_PREFIX = "otp:attempts:";
  private readonly MAX_OTP_REQUESTS = 3;
  private readonly MAX_VERIFY_ATTEMPTS = 5;
  private readonly RATE_LIMIT_WINDOW = 15 * 60;
  private loginService: LoginService;

  constructor() {
    this.loginService = new LoginService();
  }

  /**
   * Generate and send OTP for login
   */
  async loginOTP({ email, phone }: LoginOTP) {
    if (!email && !phone) {
      throw new ValidationError(
        "Email or phone must be provided to send Login OTP"
      );
    }

    const identifier = email || phone;
    const medium = email ? "email" : "phone";

    if (email) {
      emailOTP.parse({ email });
    } else {
      phoneOTP.parse({ phone });
    }

    const user = await this.findUserByIdentifier(email, phone);

    if (!user) {
      logger.warn(`OTP request for non-existent user: ${identifier}`);
      return {
        medium,
        identifier: identifier!,
        expiresIn: this.OTP_EXPIRY_SECONDS,
      };
    }
    await this.verifyAccountStatus(user);

    await this.checkRateLimit(user.id);

    const otp = genNumeric(6);
    const redisKey = `${this.OTP_KEY_PREFIX}${user.id}`;

    await RedisHelper.set(redisKey, otp, this.OTP_EXPIRY_SECONDS);

    try {
      if (medium === "email" && user.email) {
        logger.info(`[OTP] Email sent to ${this.maskEmail(user.email)}`);

        // fire event
        const p: Omit<OTPRequestedEvent, "eventId" | "timestamp" | "version"> =
          {
            eventType: KAFKA_TOPICS.AUTH.OTP_REQUESTED,
            payload: {
              userId: user.id,
              email: user.email,
              expiresAt: this.OTP_EXPIRY_SECONDS,
              otpType: "login",
              requestedAt: Date.now(),
            },
          };

        await producer.publish<AuthEvent>(KAFKA_TOPICS.AUTH.OTP_REQUESTED, p);
      } else if (medium === "phone" && user.phone) {
        // fire event
        const p: Omit<OTPRequestedEvent, "eventId" | "timestamp" | "version"> =
          {
            eventType: KAFKA_TOPICS.AUTH.OTP_REQUESTED,
            payload: {
              userId: user.id,
              phoneNumber: user.phone,
              expiresAt: this.OTP_EXPIRY_SECONDS,
              otpType: "login",
              requestedAt: Date.now(),
            },
          };

        await producer.publish<AuthEvent>(KAFKA_TOPICS.AUTH.OTP_REQUESTED, p);

        logger.info(`[OTP] SMS sent to ${this.maskPhone(user.phone)}`);
      }
    } catch (error) {
      logger.error(`[OTP] Failed to send OTP: ${error}`);
      await RedisHelper.delete(redisKey);
      throw new BadRequestError("Failed to send OTP. Please try again later.");
    }

    return {
      medium,
      identifier: this.maskIdentifier(identifier!, medium),
      expiresIn: this.OTP_EXPIRY_SECONDS,
      message: `OTP sent successfully to your ${medium}`,
    };
  }

  /**
   * Verify OTP and create session
   */
  async verifyLoginOTP(
    res: Response,
    { code, email, phone }: VerifyLoginOTP,
    deviceInfo: {
      ipAddress: string;
      device: string;
      userAgent: string;
    }
  ) {
    if (!email && !phone) {
      throw new ValidationError("Email or phone must be provided!");
    }

    if (!code) {
      throw new ValidationError("Code must be provided for verification!");
    }

    OTPSchema.parse({ code });

    const user = await this.findUserByIdentifier(email, phone);

    if (!user) {
      throw new NotFoundError("User was not found");
    }

    await this.checkVerificationAttempts(user.id);

    const redisKey = `${this.OTP_KEY_PREFIX}${user.id}`;
    const storedOtp = await RedisHelper.get(redisKey);

    if (!storedOtp) {
      throw new NotFoundError(
        "OTP not found or has expired. Please request a new code."
      );
    }

    if (storedOtp !== code) {
      await this.incrementVerificationAttempts(user.id);

      const remainingAttempts = await this.getRemainingAttempts(user.id);

      throw new BadRequestError(
        `Incorrect OTP. ${remainingAttempts} attempt(s) remaining.`
      );
    }

    await this.cleanupOTPData(user.id);

    await this.updateLastLogin(user.id);

    const sessionData = await this.loginService.createLoginSession(
      res,
      user,
      deviceInfo
    );

    logger.info(`[OTP] Successful login for user ${user.id}`);

    return sessionData;
  }

  /**
   * Verify email or phone with otp
   */
  async sendVerificationOTP(res: Response, phone: string, email: string) {
    if (!email && !phone) {
      throw new ValidationError(
        "Email or phone must be provided to send Login OTP"
      );
    }

    if (email) {
      emailOTP.parse({ email });
    } else {
      phoneOTP.parse({ phone });
    }

    const identifier = email || phone;
    const medium = email ? "email" : "phone";

    const user = await this.findUserByIdentifier(email, phone);

    if (!user) {
      logger.warn(`OTP request for non-existent user: ${identifier}`);
      return {
        medium,
        identifier: identifier!,
        expiresIn: this.OTP_EXPIRY_SECONDS,
      };
    }

    await this.checkRateLimit(user.id);

    const otp = genNumeric(6);
    const redisKey = `${this.OTP_VERIFICATION_KEY_PREFIX}${user.id}`;

    await RedisHelper.set(redisKey, otp, this.OTP_EXPIRY_SECONDS);

    try {
      if (medium === "email" && user.email) {
        // fire event
        const p: Omit<OTPRequestedEvent, "eventId" | "timestamp" | "version"> =
          {
            eventType: KAFKA_TOPICS.AUTH.OTP_REQUESTED,
            payload: {
              userId: user.id,
              email: user.email,
              expiresAt: this.OTP_EXPIRY_SECONDS,
              otpType: "login",
              requestedAt: Date.now(),
            },
          };

        await producer.publish<AuthEvent>(KAFKA_TOPICS.AUTH.OTP_REQUESTED, p);

        logger.info(`[OTP] Email sent to ${this.maskEmail(user.email)}`);
      } else if (medium === "phone" && user.phone) {
        // fire event
        const p: Omit<OTPRequestedEvent, "eventId" | "timestamp" | "version"> =
          {
            eventType: KAFKA_TOPICS.AUTH.OTP_REQUESTED,
            payload: {
              userId: user.id,
              phoneNumber: user.phone,
              expiresAt: this.OTP_EXPIRY_SECONDS,
              otpType: "login",
              requestedAt: Date.now(),
            },
          };

        await producer.publish<AuthEvent>(KAFKA_TOPICS.AUTH.OTP_REQUESTED, p);

        logger.info(`[OTP] SMS sent to ${this.maskPhone(user.phone)}`);
      }
    } catch (error) {
      logger.error(`[OTP] Failed to send OTP: ${error}`);
      await RedisHelper.delete(redisKey);
      throw new BadRequestError("Failed to send OTP. Please try again later.");
    }

    return {
      medium,
      identifier: this.maskIdentifier(identifier!, medium),
      expiresIn: this.OTP_EXPIRY_SECONDS,
      message: `Verification OTP sent successfully to your ${medium}`,
    };
  }

  /**
   * Verify verification OTP and set user verified
   */
  async validateVerificationOTP(
    res: Response,
    code: string,
    phone: string,
    email: string
  ) {
    if (!email && !phone) {
      throw new ValidationError(
        "Email or phone must be provided to send Login OTP"
      );
    }

    if (email) {
      emailOTP.parse({ email });
    } else {
      phoneOTP.parse({ phone });
    }

    const identifier = email || phone;
    const medium = email ? "email" : "phone";

    const user = await this.findUserByIdentifier(email, phone);

    if (!user) {
      throw new NotFoundError("User was not found");
    }

    await this.checkVerificationAttempts(user.id);

    const redisKey = `${this.OTP_VERIFICATION_KEY_PREFIX}${user.id}`;
    const storedOtp = await RedisHelper.get(redisKey);

    if (!storedOtp) {
      throw new NotFoundError(
        "OTP not found or has expired. Please request a new code."
      );
    }

    if (storedOtp !== code) {
      await this.incrementVerificationAttempts(user.id);

      const remainingAttempts = await this.getRemainingAttempts(user.id);

      throw new BadRequestError(
        `Incorrect OTP. ${remainingAttempts} attempt(s) remaining.`
      );
    }

    await this.cleanupOTPData(user.id);

    await this.updateAccountVerification(phone, email, user.id);

    // fire event
    const p: Omit<OTPVerifiedEvent, "eventId" | "timestamp" | "version"> = {
      eventType: KAFKA_TOPICS.AUTH.OTP_VERIFIED,
      payload: {
        userId: user.id,
        otpType: "verification",
        verifiedAt: Date.now(),
      },
    };

    await producer.publish<AuthEvent>(KAFKA_TOPICS.AUTH.OTP_VERIFIED, p);

    logger.info(`[OTP] Successful OTP verification for user ${user.id}`);

    return {
      medium,
      identifier: this.maskIdentifier(identifier!, medium),
      message: `Your ${medium} has been verified successfully`,
    };
  }

  async resendOTP(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, phone: true },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const redisKey = `${this.OTP_KEY_PREFIX}${user.id}`;
    const existingOTP = await RedisHelper.get(redisKey);

    if (existingOTP) {
      const ttl = await RedisHelper.ttl(redisKey);
      if (ttl > 240) {
        throw new BadRequestError(
          `Please wait ${Math.ceil(ttl / 60)} more minutes before requesting a new OTP.`
        );
      }
    }
    return await this.loginOTP({
      email: user.email || undefined,
      phone: user.phone || undefined,
    });
  }

  private async updateAccountVerification(
    phone: string,
    email: string,
    userId: string
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (email) {
      await prisma.user.update({
        where: { email: email },
        data: { isEmailVerified: true },
      });
    } else {
      if (!user?.phone) {
        await prisma.user.update({
          where: { id: user?.id },
          data: { phone: phone, isPhoneVerified: true },
        });
      }
      await prisma.user.update({
        where: { id: user?.id },
        data: { isPhoneVerified: true },
      });
    }
  }

  private async findUserByIdentifier(email?: string, phone?: string) {
    return await prisma.user.findFirst({
      where: {
        OR: [...(phone ? [{ phone }] : []), ...(email ? [{ email }] : [])],
      },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        isEmailVerified: true,
        lockedUntil: true,
      },
    });
  }

  private async verifyAccountStatus(user: any): Promise<void> {
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const minutesLeft = Math.ceil(
        (new Date(user.lockedUntil).getTime() - Date.now()) / 60000
      );
      throw new BadRequestError(
        `Account is temporarily locked. Please try again in ${minutesLeft} minutes.`
      );
    }

    if (user.isActive === false) {
      throw new BadRequestError(
        "This account has been suspended. Please contact support."
      );
    }

    if (!user.isEmailVerified && user.email) {
      throw new BadRequestError(
        "Please verify your email address before logging in."
      );
    }
  }

  private async checkRateLimit(userId: string): Promise<void> {
    const rateLimitKey = `${this.RATE_LIMIT_KEY_PREFIX}${userId}`;
    const requestCount = await RedisHelper.get(rateLimitKey);

    if (requestCount && parseInt(requestCount) >= this.MAX_OTP_REQUESTS) {
      throw new BadRequestError(
        `Too many OTP requests. Please try again in ${this.RATE_LIMIT_WINDOW / 60} minutes.`
      );
    }

    const newCount = await RedisHelper.increment(rateLimitKey);

    if (newCount === 1) {
      await RedisHelper.expire(rateLimitKey, this.RATE_LIMIT_WINDOW);
    }
  }

  private async checkVerificationAttempts(userId: string): Promise<void> {
    const attemptsKey = `${this.ATTEMPTS_KEY_PREFIX}${userId}`;
    const attempts = await RedisHelper.get(attemptsKey);

    if (attempts && parseInt(attempts) >= this.MAX_VERIFY_ATTEMPTS) {
      await RedisHelper.delete(`${this.OTP_KEY_PREFIX}${userId}`);
      throw new BadRequestError(
        "Too many failed attempts. Please request a new OTP."
      );
    }
  }

  private async incrementVerificationAttempts(userId: string): Promise<void> {
    const attemptsKey = `${this.ATTEMPTS_KEY_PREFIX}${userId}`;
    const newCount = await RedisHelper.increment(attemptsKey);

    if (newCount === 1) {
      await RedisHelper.expire(attemptsKey, this.OTP_EXPIRY_SECONDS);
    }
  }

  private async getRemainingAttempts(userId: string): Promise<number> {
    const attemptsKey = `${this.ATTEMPTS_KEY_PREFIX}${userId}`;
    const attempts = await RedisHelper.get(attemptsKey);
    const currentAttempts = attempts ? parseInt(attempts) : 0;
    return Math.max(0, this.MAX_VERIFY_ATTEMPTS - currentAttempts - 1);
  }

  private async cleanupOTPData(userId: string): Promise<void> {
    await Promise.all([
      RedisHelper.delete(`${this.OTP_KEY_PREFIX}${userId}`),
      RedisHelper.delete(`${this.ATTEMPTS_KEY_PREFIX}${userId}`),
      RedisHelper.delete(`${this.RATE_LIMIT_KEY_PREFIX}${userId}`),
    ]);
  }

  private async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }

  private maskEmail(email: string): string {
    const [local, domain] = email.split("@");
    return `${local.substring(0, 2)}***@${domain}`;
  }

  private maskPhone(phone: string): string {
    return `***${phone.slice(-4)}`;
  }

  private maskIdentifier(identifier: string, medium: string): string {
    return medium === "email"
      ? this.maskEmail(identifier)
      : this.maskPhone(identifier);
  }
}
