import { Response } from "express";
import * as QRCode from "qrcode";
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from "@mta/common";
import { prisma } from "../db/prisma";
import { RedisHelper } from "../common/utils/redis.helpers";
import logger from "../config/logger";
import { LoginService } from "./login.service";
import {
  generate2FASecret,
  verify2FACode,
} from "../common/utils/auth/2fa.utils";
import { eventBus, producer } from "../events";
import { KAFKA_TOPICS } from "@mta/events";
import { TwoFADisabledEvent, TwoFAEnabledEvent } from "@mta/constants";

interface DeviceInfo {
  device: string;
  ipAddress: string;
  userAgent: string;
}

interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

interface TwoFactorChallengeResponse {
  twoFactorRequired: true;
  challengeToken: string;
  userId: string;
  expiresIn: number;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  sessionId: string;
}

export class TwoFactorAuthService {
  private readonly CHALLENGE_TOKEN_PREFIX = "2fa:challenge:";
  private readonly CHALLENGE_EXPIRY = 5 * 60;
  private readonly BACKUP_CODES_COUNT = 10;
  private readonly MAX_2FA_ATTEMPTS = 5;
  private loginService: LoginService;

  constructor(loginService: LoginService) {
    this.loginService = loginService;
  }

  /**
   * Step 1: Generate 2FA secret and QR code for user to scan
   */
  async setup2FA(userId: string): Promise<TwoFactorSetupResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        isTwoFactorEnabled: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (user.isTwoFactorEnabled) {
      throw new BadRequestError(
        "2FA is already enabled. Disable it first to set up again."
      );
    }

    // Generate secret
    const { base32, qrCodeDataUrl } = await generate2FASecret(user.email);

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => this.hashBackupCode(code))
    );

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: base32,
        // twoFactorBackupCodes: hashedBackupCodes,
        isTwoFactorEnabled: false,
      },
    });

    await prisma.twoFactor.create({
      data: { secret: base32, qrcode: qrCodeDataUrl, userId: user.id },
    });

    logger.info(`[2FA] Setup initiated for user ${userId}`);

    return {
      secret: base32,
      qrCode: qrCodeDataUrl,
      backupCodes,
    };
  }

  /**
   * Step 2: Verify setup by validating a TOTP code
   */
  async verify2FASetup(userId: string, token: string) {
    if (!token) {
      throw new BadRequestError(
        "Token must be provided to verify 2FA for this account."
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        twoFactorSecret: true,
        isTwoFactorEnabled: true,
      },
    });

    if (!user || !user.twoFactorSecret) {
      throw new NotFoundError("2FA setup not found. Please start setup again.");
    }

    if (user.isTwoFactorEnabled) {
      throw new BadRequestError("2FA is already enabled");
    }

    // Verify the token
    const isValid = verify2FACode(user.twoFactorSecret, token);

    if (!isValid) {
      throw new UnauthorizedError("Invalid verification code");
    }

    // Enable 2FA
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true },
      select: {
        id: true,
        name: true,
        email: true,
        isTwoFactorEnabled: true,
      },
    });

    // emit 2fa event
    const eventData = {
      eventType: KAFKA_TOPICS.AUTH.TWO_FA_ENABLED,
      payload: {
        enabledAt: Date.now(),
        email: updatedUser.email,
        userId: updatedUser.id,
        method: "totp",
      },
    };

    await producer.publish(KAFKA_TOPICS.AUTH.TWO_FA_ENABLED, eventData);

    logger.info(`[2FA] Successfully enabled for user ${userId}`);

    return { updatedUser };
  }

  /**
   * Disable 2FA
   */
  async disable2FA(
    userId: string,
    token: string,
    isBackupCode: boolean = false
  ): Promise<void> {
    if (!token) {
      throw new BadRequestError("Token must be provided to disable 2FA.");
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        twoFactorSecret: true,
        // twoFactorBackupCodes: true,
        isTwoFactorEnabled: true,
      },
    });

    if (!user || !user.isTwoFactorEnabled) {
      throw new BadRequestError("2FA is not enabled");
    }

    let isValid = false;

    if (isBackupCode) {
      //   isValid = await this.verifyBackupCode(
      //     user.twoFactorBackupCodes || [],
      //     token
      //   );
      isValid = false;
    } else {
      isValid = verify2FACode(user.twoFactorSecret!, token);
    }

    if (!isValid) {
      throw new UnauthorizedError("Invalid code");
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isTwoFactorEnabled: false,
        twoFactorSecret: null,
        // twoFactorBackupCodes: null,
      },
    });

    await prisma.twoFactor.deleteMany({ where: { userId: updatedUser.id } });

    // emit 2fa event
    const eventData = {
      eventType: KAFKA_TOPICS.AUTH.TWO_FA_DISABLED,
      payload: {
        disabledAt: Date.now(),
        email: updatedUser.email,
        userId: updatedUser.id,
      },
    };

    await producer.publish(KAFKA_TOPICS.AUTH.TWO_FA_DISABLED, eventData);

    logger.info(`[2FA] Disabled for user ${userId}`);
  }

  /**
   * Called during login when 2FA is detected
   * Creates a challenge token for the 2FA verification step
   */
  async create2FAChallenge(
    userId: string,
    deviceInfo: DeviceInfo
  ): Promise<TwoFactorChallengeResponse> {
    const challengeToken = this.generateChallengeToken();
    const redisKey = `${this.CHALLENGE_TOKEN_PREFIX}${challengeToken}`;

    await RedisHelper.set(
      redisKey,
      JSON.stringify({ userId, deviceInfo }),
      this.CHALLENGE_EXPIRY
    );

    logger.info(`[2FA] Challenge created for user ${userId}`);

    return {
      twoFactorRequired: true,
      challengeToken,
      userId,
      expiresIn: this.CHALLENGE_EXPIRY,
    };
  }

  /**
   * Verify 2FA code and complete login
   */
  async verify2FALogin(
    res: Response,
    challengeToken: string,
    code: string,
    isBackupCode: boolean = false
  ): Promise<LoginResponse> {
    if (!challengeToken || !code) {
      throw new ValidationError("Challenge token and code are required");
    }

    await this.check2FAAttempts(challengeToken);

    const redisKey = `${this.CHALLENGE_TOKEN_PREFIX}${challengeToken}`;
    const challengeData = await RedisHelper.get(redisKey);

    if (!challengeData) {
      throw new UnauthorizedError(
        "2FA challenge expired or invalid. Please login again."
      );
    }

    const { userId, deviceInfo } = JSON.parse(challengeData);

    // Get user's 2FA secret
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        twoFactorSecret: true,
        // twoFactorBackupCodes: true,
        isTwoFactorEnabled: true,
      },
    });

    if (!user || !user.isTwoFactorEnabled || !user.twoFactorSecret) {
      throw new UnauthorizedError("2FA not properly configured");
    }

    let isValid = false;
    let usedBackupCode: string | null = null;

    if (isBackupCode) {
      const result = await this.verifyAndConsumeBackupCode(user.id, [], code);
      isValid = result.valid;
      usedBackupCode = result.code;
    } else {
      isValid = verify2FACode(user.twoFactorSecret, code);
    }

    if (!isValid) {
      await this.increment2FAAttempts(challengeToken);
      throw new UnauthorizedError("Invalid 2FA code");
    }

    await RedisHelper.delete(redisKey);
    await RedisHelper.delete(`2fa:attempts:${challengeToken}`);

    const { accessToken, refreshToken, sessionId } =
      await this.loginService.createLoginSession(res, user, deviceInfo);

    logger.info(
      `[2FA] Login successful for user ${userId}` +
        (usedBackupCode ? " (backup code used)" : "")
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      sessionId: sessionId,
    };
  }

  /**
   * Regenerate backup codes (requires current 2FA code)
   */
  async regenerateBackupCodes(
    userId: string,
    currentCode: string
  ): Promise<string[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        twoFactorSecret: true,
        isTwoFactorEnabled: true,
      },
    });

    if (!user || !user.isTwoFactorEnabled) {
      throw new BadRequestError("2FA is not enabled");
    }

    // Verify current code
    const isValid = verify2FACode(user.twoFactorSecret!, currentCode);

    if (!isValid) {
      throw new UnauthorizedError("Invalid 2FA code");
    }

    // Generate new backup codes
    const backupCodes = this.generateBackupCodes();
    const hashedBackupCodes = await Promise.all(
      backupCodes.map((code) => this.hashBackupCode(code))
    );

    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { twoFactorBackupCodes: hashedBackupCodes },
    // });

    logger.info(`[2FA] Backup codes regenerated for user ${userId}`);

    return backupCodes;
  }

  private generateChallengeToken(): string {
    return require("crypto").randomBytes(32).toString("hex");
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < this.BACKUP_CODES_COUNT; i++) {
      const code = require("crypto")
        .randomBytes(4)
        .toString("hex")
        .toUpperCase();
      codes.push(code);
    }
    return codes;
  }

  private async hashBackupCode(code: string): Promise<string> {
    const bcrypt = require("bcryptjs");
    return await bcrypt.hash(code, 10);
  }

  private async verifyBackupCode(
    hashedCodes: string[],
    inputCode: string
  ): Promise<boolean> {
    const bcrypt = require("bcrypts");
    for (const hashedCode of hashedCodes) {
      const isMatch = await bcrypt.compare(inputCode, hashedCode);
      if (isMatch) return true;
    }
    return false;
  }

  private async verifyAndConsumeBackupCode(
    userId: string,
    hashedCodes: string[],
    inputCode: string
  ): Promise<{ valid: boolean; code: string | null }> {
    const bcrypt = require("bcryptjs");

    for (let i = 0; i < hashedCodes.length; i++) {
      const isMatch = await bcrypt.compare(inputCode, hashedCodes[i]);
      if (isMatch) {
        const updatedCodes = hashedCodes.filter((_, index) => index !== i);
        // await prisma.user.update({
        //   where: { id: userId },
        //   data: { twoFactorBackupCodes: updatedCodes },
        // });
        return { valid: true, code: inputCode };
      }
    }
    return { valid: false, code: null };
  }

  private async check2FAAttempts(challengeToken: string): Promise<void> {
    const attemptsKey = `2fa:attempts:${challengeToken}`;
    const attempts = await RedisHelper.get(attemptsKey);

    if (attempts && parseInt(attempts) >= this.MAX_2FA_ATTEMPTS) {
      await RedisHelper.delete(
        `${this.CHALLENGE_TOKEN_PREFIX}${challengeToken}`
      );
      throw new UnauthorizedError(
        "Too many failed attempts. Please login again."
      );
    }
  }

  private async increment2FAAttempts(challengeToken: string): Promise<void> {
    const attemptsKey = `2fa:attempts:${challengeToken}`;
    const newCount = await RedisHelper.increment(attemptsKey);

    if (newCount === 1) {
      await RedisHelper.expire(attemptsKey, this.CHALLENGE_EXPIRY);
    }
  }
}
