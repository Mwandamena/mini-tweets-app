import { Response, Request } from "express";
import { SessionService } from "./session.service";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  BadRequestError,
  HTTP_STATUS,
  ApiResponse,
  generateToken,
  verifyRefreshToken,
} from "@mta/common";
import { loginSchema, OTPSchema } from "../validators/auth.schema";
import { prisma } from "../db/prisma";
import { comparePasswords } from "../common/utils/auth/password.util";
import logger from "../config/logger";
import { TwoFactorAuthService } from "./2fa.service";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginOTP {
  email: string;
  phone: string;
}

interface VerifyLoginOTP extends LoginOTP {
  code: string;
}

interface DeviceInfo {
  device: string;
  ipAddress: string;
  userAgent: string;
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

interface TwoFactorResponse {
  twoFactorRequired: boolean;
  userId: string;
  tempToken?: string;
  expiresIn: number;
}

export class LoginService {
  private OTP_EXPIRY_SECONDS: number;
  private OTP_KEY_PREFIX: string;
  private twoFactorService: TwoFactorAuthService;

  constructor() {
    this.OTP_EXPIRY_SECONDS = 5 * 60;
    this.OTP_KEY_PREFIX = "otp:login:";
    this.twoFactorService = new TwoFactorAuthService(this);
  }

  async emailLogin(
    res: Response,
    deviceInfo: DeviceInfo,
    credentials: LoginInput
  ): Promise<LoginResponse | TwoFactorResponse> {
    this.validateLoginInput(credentials);

    const account = await this.fetchAccount(credentials.email);

    this.verifyAccountStatus(account);

    await this.verifyPassword(
      account.email,
      credentials.password,
      account.password
    );

    if (account.isTwoFactorEnabled) {
      const { twoFactorRequired, userId, tempToken } =
        await this.handle2FARequired(res, account.id, deviceInfo);

      ApiResponse.success(
        res,
        {
          userId: userId,
          twoFactorRequired: twoFactorRequired,
          tempToken: tempToken,
        },
        "Two Factor Authentication is enabled on this account. Use your authenticator app or back up codes to login."
      );
    }

    return await this.createLoginSession(res, account, deviceInfo);
  }

  private validateLoginInput({ email, password }: LoginInput): void {
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    loginSchema.parse({ email, password });
  }

  private async handleExistingSession(userId: string): Promise<void> {
    const existingSession = await SessionService.getUserSessions(userId);

    console.log(existingSession);

    if (existingSession) {
      throw new ConflictError(
        "User is already logged in. Please logout first."
      );
    }
  }

  private async fetchAccount(email: string) {
    const account = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        isEmailVerified: true,
        isTwoFactorEnabled: true,
        lastLoginAt: true,
        loginAttempts: true,
        lockedUntil: true,
      },
    });

    if (!account) {
      throw new NotFoundError("Invalid email or password");
    }

    return account;
  }

  private verifyAccountStatus(account: any): void {
    if (account.lockedUntil && new Date(account.lockedUntil) > new Date()) {
      const minutesLeft = Math.ceil(
        (new Date(account.lockedUntil).getTime() - Date.now()) / 60000
      );
      throw new UnauthorizedError(
        `Account is temporarily locked. Please try again in ${minutesLeft} minutes.`
      );
    }

    if (account.isActive === false) {
      throw new UnauthorizedError(
        "This account has been suspended. Please contact support."
      );
    }

    if (!account.isEmailVerified) {
      throw new UnauthorizedError(
        "Please verify your email address before logging in."
      );
    }
  }

  private async verifyPassword(
    email: string,
    inputPassword: string,
    hashedPassword: string
  ): Promise<void> {
    const isMatch = await comparePasswords(inputPassword, hashedPassword);

    if (!isMatch) {
      await this.handleFailedLogin(email);
      throw new UnauthorizedError("Invalid email or password");
    }

    await this.resetLoginAttempts(email);
  }

  private async handleFailedLogin(email: string): Promise<void> {
    const MAX_ATTEMPTS = 5;
    const LOCK_DURATION_MINUTES = 15;

    await prisma.user.update({
      where: { email },
      data: {
        loginAttempts: { increment: 1 },
      },
    });

    const user = await prisma.user.findUnique({
      where: { email },
      select: { loginAttempts: true },
    });

    if (user && user.loginAttempts >= MAX_ATTEMPTS) {
      const lockUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60000);
      await prisma.user.update({
        where: { email },
        data: {
          lockedUntil: lockUntil,
          loginAttempts: 0,
        },
      });
    }
  }

  private async resetLoginAttempts(email: string): Promise<void> {
    await prisma.user.update({
      where: { email },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });
  }

  private async handle2FARequired(
    res: Response,
    userId: string,
    deviceInfo: DeviceInfo
  ): Promise<TwoFactorResponse> {
    const {
      challengeToken,
      expiresIn,
      userId: id,
      twoFactorRequired,
    } = await this.twoFactorService.create2FAChallenge(userId, deviceInfo);

    return {
      twoFactorRequired: twoFactorRequired,
      userId,
      tempToken: challengeToken,
      expiresIn,
    };
  }

  async createLoginSession(
    res: Response,
    account: any,
    deviceInfo: DeviceInfo
  ): Promise<LoginResponse> {
    const { accessToken, refreshToken } = generateToken(account.id);

    const session = await SessionService.createSession(
      account.id,
      account.name,
      account.email,
      deviceInfo
    );

    this.setAuthCookies(res, accessToken, refreshToken, session.sessionId);

    return {
      accessToken,
      refreshToken,
      user: {
        id: account.id,
        email: account.email,
        name: account.name,
      },
      sessionId: session.sessionId,
    };
  }

  setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    sessionId: string
  ): void {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private destroyAuthCookies(res: Response): void {
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });

    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });
    res.cookie("sessionId", "", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });
  }

  async checkActiveSession(userId: string): Promise<boolean> {
    const activeSessions = await SessionService.getUserSessions(userId);
    return activeSessions.length > 0;
  }

  async logoutAllDevices(res: Response, userId: string): Promise<void> {
    await SessionService.destroyAllSessions(userId);
    this.destroyAuthCookies(res);
  }

  async logout(res: Response, userId: string, sessionId: string) {
    if (!userId) {
      throw new UnauthorizedError(
        "User not authorized to perform this action."
      );
    }

    const session = await SessionService.validateSession(sessionId);

    if (!session) {
      throw new NotFoundError("User is not logged in. Login to your account.");
    }

    const sessionKey = `session:${session.sessionId}`;

    await SessionService.destroySession(sessionKey, userId);

    this.destroyAuthCookies(res);

    return {
      message: "Logout successfull",
    };
  }

  async revokeRefreshToken(res: Response, req: Request) {
    // 1. Check for Cookies and Refresh Token
    if (!req.cookies) {
      throw new BadRequestError("Cookies are missing in the request.");
    }

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      this.destroyAuthCookies(res);
      return ApiResponse.success(
        res,
        null,
        "No refresh token found. Client cookies cleared."
      );
    }

    let userId: string;
    let sessionId: string;

    try {
      const decoded = verifyRefreshToken(refreshToken);
      userId = decoded.userId;
      sessionId = decoded.sessionId!;
    } catch (error) {
      this.destroyAuthCookies(res);
      logger.warn("Revocation attempt with invalid/expired refresh token");
      return ApiResponse.success(
        res,
        null,
        "Logout successful. Invalid token discarded."
      );
    }

    await SessionService.destroySession(sessionId, userId);

    this.destroyAuthCookies(res);

    return ApiResponse.success(
      res,
      null,
      "Tokens revoked successfully and session destroyed."
    );
  }

  async requestRefreshToken(res: Response, req: Request) {
    if (!req.cookies) {
      throw new NotFoundError("No cookies available");
    }

    const oldRefreshToken = req.cookies.refreshToken;

    let userId: string;
    let sessionId: string;

    try {
      const decodedPayload = verifyRefreshToken(oldRefreshToken);
      userId = decodedPayload.id;
      sessionId = decodedPayload.sessionId! || req.cookies.sessionId;
    } catch (error) {
      this.destroyAuthCookies(res);
      throw new BadRequestError(
        "Invalid or expired refresh token. Please log in again."
      );
    }

    const session = await SessionService.validateSession(sessionId);
    if (!session) {
      this.destroyAuthCookies(res);
      throw new NotFoundError("Session not found. Access revoked.");
    }

    const { accessToken, refreshToken: newRefreshToken } = generateToken(
      userId,
      { sessionId }
    );

    this.setAuthCookies(res, accessToken, newRefreshToken, session.sessionId);

    return ApiResponse.success(
      res,
      { accessToken },
      "Token refreshed successfully"
    );
  }
}
