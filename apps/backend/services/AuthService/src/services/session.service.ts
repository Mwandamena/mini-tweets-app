import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import { RedisHelper } from "../common/utils/redis.helpers";
import { generateToken } from "@mta/common";

const SESSION_EXPIRY = 7 * 24 * 60 * 60;
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60;

interface SessionData {
  sessionId: string;
  userId: string;
  username: string;
  email: string;
  device?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  lastAccessedAt: string;
}

export class SessionService {
  static async createSession(
    userId: string,
    username: string,
    email: string,
    metadata?: {
      device?: string;
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<{ sessionId: string; accessToken: string; refreshToken: string }> {
    const sessionId = randomUUID();
    const sessionData: SessionData = {
      userId,
      username,
      sessionId,
      email,
      device: metadata?.device,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      createdAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };

    const sessionKey = `session:${sessionId}`;
    await RedisHelper.setHash(sessionKey, sessionData as any);
    await RedisHelper.expire(sessionKey, SESSION_EXPIRY);

    await RedisHelper.addToSet(`user:${userId}:sessions`, sessionId);

    const { accessToken, refreshToken } = generateToken(userId, {
      sessionId: sessionId,
    });

    return { sessionId, accessToken, refreshToken };
  }

  static async validateSession(sessionId: string): Promise<SessionData | null> {
    const sessionKey = `session:${sessionId}`;
    const exists = await RedisHelper.exists(sessionKey);

    if (!exists) {
      return null;
    }

    // Get session data
    const sessionData = await RedisHelper.getHash(sessionKey);

    // Update last accessed time
    await RedisHelper.setHash(sessionKey, {
      ...sessionData,
      lastAccessedAt: new Date().toISOString(),
    });

    await RedisHelper.expire(sessionKey, SESSION_EXPIRY);

    return sessionData as unknown as SessionData;
  }

  static async refreshAccessToken(
    refreshToken: string
  ): Promise<{ accessToken: string } | null> {
    const refreshKey = `refresh:${refreshToken}`;
    const data = await RedisHelper.get(refreshKey);

    if (!data) {
      return null;
    }

    const { userId, sessionId } = JSON.parse(data);

    const session = await this.validateSession(sessionId);
    if (!session) {
      return null;
    }

    const { accessToken } = generateToken(session.userId);

    return { accessToken };
  }

  static async destroySession(
    sessionId: string,
    userId: string
  ): Promise<void> {
    const sessionKey = `session:${sessionId}`;

    await RedisHelper.delete(sessionKey);

    await RedisHelper.removeFromSet(`user:${userId}:sessions`, sessionId);
  }

  static async destroyAllSessions(userId: string): Promise<void> {
    const sessionIds = await RedisHelper.getSet(`user:${userId}:sessions`);

    for (const sessionId of sessionIds) {
      await RedisHelper.delete(`session:${sessionId}`);
    }

    await RedisHelper.delete(`user:${userId}:sessions`);
  }

  static async getUserSessions(userId: string): Promise<SessionData[]> {
    const sessionIds = await RedisHelper.getSet(`user:${userId}:sessions`);

    const sessions: SessionData[] = [];
    for (const sessionId of sessionIds) {
      const sessionKey = `session:${sessionId}`;
      const sessionData = await RedisHelper.getHash(sessionKey);
      if (Object.keys(sessionData).length > 0) {
        sessions.push(sessionData as unknown as SessionData);
      }
    }

    return sessions;
  }
}
