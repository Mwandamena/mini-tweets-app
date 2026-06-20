import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma";
import {
  UnauthorizedError,
  ConflictError,
  ExpiredTokenOrCode,
  NotFoundError,
  ValidationError,
  ApiResponse,
  BadRequestError,
  HTTP_STATUS,
  generateTempToken,
  verifyTempToken,
  generateEmailToken,
} from "@mta/common";
import {
  generate2FASecret,
  verify2FACode,
} from "../common/utils/auth/2fa.utils";

import {
  changeEmailSchema,
  changePasswordSchema,
  emailOTP,
  OTPSchema,
  phoneOTP,
  registerSchema,
} from "../validators/auth.schema";
import { RegisterInput } from "../common/auth/account.types";
import {
  comparePasswords,
  hashPassword,
} from "../common/utils/auth/password.util";
import { Response, Request } from "express";
import { SessionService } from "./session.service";
import { email } from "zod";
import { LoginService } from "./login.service";
import { RedisHelper } from "../common/utils/redis.helpers";
import { producer } from "../events";
import {
  AuthEvent,
  EmailChangedEvent,
  EmailChangeRequestEvent,
  EmailFailedEvent,
  EmailVerificationRequestedEvent,
  EmailVerifiedEvent,
  KAFKA_TOPICS,
  PasswordChangedEvent,
  UserRegisteredEvent,
} from "@mta/constants";
import logger from "../config/logger";

export class AuthService {
  private jwtSecret: string;
  private token: string;
  private jwt: any;
  private mailService: any;
  private sessionService: SessionService;
  private loginService: LoginService;
  private OTP_EXPIRY_SECONDS: number;
  private OTP_KEY_PREFIX: string;

  constructor() {
    this.OTP_EXPIRY_SECONDS = 5 * 60;
    this.OTP_KEY_PREFIX = "otp:verify:";
    this.jwtSecret = process.env.JWT_SECRET || "secret_key";
    if (!this.jwtSecret) throw new Error("JWT_SECRET not set");
    this.token = "";
    this.jwt = jwt;
    this.sessionService = new SessionService();
    this.loginService = new LoginService();
  }

  /* 
    REGISTER USER: function
  */
  async registerUser({ username, email, password }: RegisterInput) {
    if (!username || !email || !password) {
      throw new ValidationError(
        "Username, email and password are required to register an account."
      );
    }

    // validate
    registerSchema.parse({ username, email, password });

    // check if the user email exits
    const accountExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (accountExist) {
      throw new ConflictError(
        "The email is already registered to an account. Try using another one."
      );
    }

    // check username availability
    const usernameExist = await prisma.user.findFirst({
      where: {
        name: username,
      },
    });

    if (usernameExist) {
      throw new ConflictError(
        "Username is already taken. Try using a different name."
      );
    }

    const hashedPassword = await hashPassword(password);

    // Store user in mongo
    const account = await prisma.user.create({
      data: {
        name: username,
        password: hashedPassword,
        email: email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // send verification email
    const verificationToken = generateTempToken(
      account.id,
      "email-verification"
    );

    const payload: Omit<
      UserRegisteredEvent,
      "eventId" | "timestamp" | "version"
    > = {
      eventType: KAFKA_TOPICS.AUTH.USER_REGISTERED,
      payload: {
        userId: account.id,
        email: account.email,
        username: account.name,
        registeredAt: new Date().getFullYear(),
        registrationMethod: "email",
      },
      correlationId: "",
    };

    try {
      await producer.publish(KAFKA_TOPICS.AUTH.USER_REGISTERED, payload);
      logger.info(`User registered event published successfully!`);
    } catch (e) {
      logger.error("Failed to publish user registration event.");
    }

    return { account, verificationToken };
  }

  /* 
    ENABLE 2FA: function
  */
  async enable2FA(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isTwoFactorEnabled: true,
        isEmailVerified: true,
        isPhoneVerified: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    if (!user.isEmailVerified && !user.isPhoneVerified) {
      throw new UnauthorizedError("Verify your phone or email to enable 2FA.");
    }

    if (user.isTwoFactorEnabled) {
      throw new ConflictError("Two factor authentication is already enabled");
    }

    const secret = await generate2FASecret(user.email);

    const tf = await prisma.twoFactor.create({
      data: {
        userId,
        secret: secret.base32,
        qrcode: secret.qrCodeDataUrl,
      },
    });
    return { secret, tf, user };
  }

  /* 
    VERIFY 2FA: function
  */
  async verify2FA(
    res: Response,
    userId: string,
    token: string,
    device: string | undefined,
    ua: string | undefined,
    ip: string | undefined
  ) {
    if (!token) {
      throw new BadRequestError(
        "Token is not provided. Please provide a token."
      );
    }

    if (!email) {
      throw new BadRequestError(
        "An email or phone must be provided to verify 2FA"
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isTwoFactorEnabled: true,
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      throw new NotFoundError(
        "User to verify 2FA not found. Try creating an account."
      );
    }

    const tf = await prisma.twoFactor.findFirst({ where: { userId } });

    if (!tf || !tf.secret)
      throw new NotFoundError(
        "2FA is not configured on this account. Please enable 2FA."
      );

    const verified = verify2FACode(tf.secret, token);

    if (!verified) {
      throw new ExpiredTokenOrCode("Invalid 2FA token provided!");
    }

    const { accessToken, refreshToken, sessionId } =
      await SessionService.createSession(userId, user.name, user.email, {
        device,
        userAgent: ua,
        ipAddress: ip,
      });

    this.loginService.setAuthCookies(res, accessToken, refreshToken, sessionId);

    return { verified, tf, accessToken, refreshToken, sessionId, user };
  }

  /* 
    VERIFY EMAIL: function
  */
  async verifyEmail(res: Response, token: any) {
    if (!token) {
      throw new BadRequestError(
        "Query params are required to verify the email."
      );
    }

    const payload = verifyTempToken(token, "email-verification");
    const userId = payload.id;

    if (!payload) {
      throw new ExpiredTokenOrCode(
        "Token expired or invalid. Please request a new one."
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
        isPhoneVerified: true,
        isTwoFactorEnabled: true,
        name: true,
        phone: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (user.isEmailVerified) {
      throw new ConflictError("Email is already verified!");
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
      },
    });

    // send email verified event
    const p: Omit<EmailVerifiedEvent, "eventId" | "timestamp" | "version"> = {
      eventType: KAFKA_TOPICS.AUTH.EMAIL_VERIFIED,
      payload: {
        userId: updatedUser.id,
        email: updatedUser.email,
        verifiedAt: Date.now(),
      },
    };

    await producer.publish(KAFKA_TOPICS.AUTH.EMAIL_VERIFIED, p);

    return { updatedUser };
  }

  /* 
    RESEND VERIFCATION EMAIL LINK: function
  */
  async resendVerificationEmail(res: Response, email: string) {
    if (!email) {
      throw new BadRequestError(
        "An email must be provided to send verification link"
      );
    }
    emailOTP.parse({ email });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, isEmailVerified: true },
    });

    if (!user) {
      throw new NotFoundError("An email verification link has been sent.");
    }

    const verificationToken = generateTempToken(user.id, "email-verification");

    // email verification request event
    const p: Omit<
      EmailVerificationRequestedEvent,
      "eventId" | "timestamp" | "version"
    > = {
      eventType: KAFKA_TOPICS.AUTH.EMAIL_VERIFICATION_REQUESTED,
      payload: {
        userId: user.id,
        email: user.email,
        verificationToken,
        expiresAt: Date.now() + 60 * 60 * 1000,
        requestedAt: Date.now(),
      },
    };

    await producer.publish(KAFKA_TOPICS.AUTH.EMAIL_VERIFICATION_REQUESTED, p);

    return verificationToken;
  }

  /* 
    CHANGE EMAIL: function
  */
  async requestPasswordChange(
    oldPassword: string,
    newPassword: string,
    userId: string,
    res: Response
  ) {
    if (!oldPassword || !newPassword) {
      throw new BadRequestError(
        "Your old password and your new password must be provided to change your password."
      );
    }
    if (!userId) {
      throw new BadRequestError(
        "User ID must be provided to complete the request."
      );
    }

    changePasswordSchema.parse({ oldPassword, newPassword });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true, email: true },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Verify current password
    const isPasswordValid = await comparePasswords(oldPassword, user.password);

    if (!isPasswordValid) {
      throw new BadRequestError("Current password is incorrect.");
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    await this.loginService.logoutAllDevices(res, updatedUser.id);

    // TODO: Send email notification
    const p: Omit<PasswordChangedEvent, "eventId" | "timestamp" | "version"> = {
      eventType: KAFKA_TOPICS.AUTH.PASSWORD_CHANGED,
      payload: {
        userId: updatedUser.id,
        email: updatedUser.email,
        changedAt: Date.now(),
        requireReauthentication: true,
      },
    };

    await producer.publish(KAFKA_TOPICS.AUTH.PASSWORD_CHANGED, p);

    return updatedUser;
  }

  /* 
    CHANGE PASSWORD: function
  */
  async requestEmailChange(
    password: string,
    newEmail: string,
    userId: string,
    req: Request
  ) {
    if (!newEmail || !password) {
      throw new BadRequestError("New email and password are required");
    }

    changeEmailSchema.parse({ newEmail, password });

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, password: true, name: true },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.email === newEmail) {
      throw new BadRequestError(
        "New email must be different from current email"
      );
    }

    // Verify password
    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError("Incorrect password");
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }

    // Generate verification token
    const { token, tokenExpiry } = generateEmailToken();

    // Store verification token in Redis
    await RedisHelper.set(
      `email-change:${token}`,
      JSON.stringify({
        userId,
        newEmail,
        oldEmail: user.email,
      }),
      3600
    );

    // TODO: Create notification service event
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email-change?token=${token}`;

    // emit email change event
    const p: Omit<
      EmailChangeRequestEvent,
      "eventId" | "timestamp" | "version"
    > = {
      eventType: KAFKA_TOPICS.AUTH.EMAIL_CHANGE_REQUESTED,
      payload: {
        userId: user.id,
        email: user.email,
        requestedAt: Date.now(),
        verificationToken: token,
        expiresAt: Date.now() + 3600,
      },
    };

    await producer.publish<AuthEvent>(KAFKA_TOPICS.AUTH.EMAIL_CHANGED, p);

    return {
      verificationLink,
    };
  }

  async verifyEmailChangeRequest(token: string, res: Response) {
    if (!token) {
      throw new BadRequestError("Verification token is required");
    }

    // Get token data from Redis
    const tokenKey = `email-change:${token}`;
    const tokenData = await RedisHelper.get(tokenKey);

    if (!tokenData) {
      throw new BadRequestError("Invalid or expired verification token");
    }

    const { userId, newEmail, oldEmail } = JSON.parse(tokenData);

    // Check if email is still available
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail },
    });

    if (existingUser && existingUser.id !== userId) {
      await RedisHelper.delete(tokenKey);
      throw new BadRequestError("Email is no longer available");
    }

    // Update email
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        email: newEmail,
      },
    });

    // TODO: send verify event change
    const p: Omit<EmailChangedEvent, "eventId" | "timestamp" | "version"> = {
      eventType: KAFKA_TOPICS.AUTH.EMAIL_CHANGED,
      payload: {
        userId: user.id,
        email: user.email,
        changedAt: Date.now(),
        requireReauthentication: true,
      },
    };

    await producer.publish<AuthEvent>(KAFKA_TOPICS.AUTH.EMAIL_CHANGED, p);

    // Delete verification token
    await RedisHelper.delete(tokenKey);
    await this.loginService.logoutAllDevices(res, user.id);
  }
}
