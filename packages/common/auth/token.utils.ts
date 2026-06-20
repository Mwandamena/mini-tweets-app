import { randomUUID } from "crypto";
import { ExpiredTokenOrCode } from "../utils/custom.error";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

// Ensure JWT secrets are available
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

const jwtSecret = process.env.JWT_SECRET as Secret;
const jwtRefreshSecret = (process.env.JWT_REFRESH_SECRET ||
  process.env.JWT_SECRET) as Secret;

export interface TokenPayload extends JwtPayload {
  id: string;
  type?: "access" | "refresh" | "temp" | "2fa";
  sessionId?: string;
  purpose?: string;
}

interface GenerateTokenOptions {
  accessTokenExpiry?: string;
  refreshTokenExpiry?: string;
  sessionId?: string;
}

export function generateToken(
  id: string,
  options?: GenerateTokenOptions
): {
  refreshToken: string;
  accessToken: string;
} {
  const {
    accessTokenExpiry = "30d",
    refreshTokenExpiry = "7d",
    sessionId,
  } = options || {};

  const basePayload = { id, sessionId };

  const accessTokenPayload: TokenPayload = { ...basePayload, type: "access" };
  const accessToken = jwt.sign(accessTokenPayload, jwtSecret, {
    expiresIn: accessTokenExpiry,
  } as SignOptions);

  const refreshTokenPayload: TokenPayload = { ...basePayload, type: "refresh" };
  const refreshToken = jwt.sign(refreshTokenPayload, jwtRefreshSecret, {
    expiresIn: refreshTokenExpiry,
  } as SignOptions);

  return { refreshToken, accessToken };
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

    if (decoded.type && decoded.type !== "access") {
      throw new ExpiredTokenOrCode("Invalid token type");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ExpiredTokenOrCode("Access token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ExpiredTokenOrCode("Invalid access token");
    }
    throw error;
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, jwtRefreshSecret) as TokenPayload;

    if (decoded.type && decoded.type !== "refresh") {
      throw new ExpiredTokenOrCode("Invalid token type");
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ExpiredTokenOrCode("Refresh token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ExpiredTokenOrCode("Invalid refresh token");
    }
    throw error;
  }
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload | null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

export function getTokenExpiry(token: string): Date | null {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  return new Date(decoded.exp * 1000);
}

export async function refreshAccessToken(
  refreshToken: string,
  sessionId?: string
): Promise<{ accessToken: string }> {
  const decoded = verifyRefreshToken(refreshToken);

  const accessTokenPayload: TokenPayload = {
    id: decoded.id,
    type: "access",
    sessionId: sessionId || decoded.sessionId,
  };

  const accessToken = jwt.sign(accessTokenPayload, jwtSecret, {
    expiresIn: "30d",
  });

  return { accessToken };
}

export const generateEmailToken = () => {
  const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
  const token = randomUUID();
  return { token, tokenExpiry };
};

export function generateTempToken(
  id: string,
  purpose: "password-reset" | "email-verification" | "2fa" | "email-change",
  expiry: string = "10m"
): string {
  const payload: TokenPayload = {
    id,
    type: "temp",
    purpose,
  };

  return jwt.sign(payload, jwtSecret, { expiresIn: expiry } as SignOptions);
}

export function verifyTempToken(
  token: string,
  expectedPurpose?: string
): TokenPayload {
  const decoded = jwt.verify(token, jwtSecret) as TokenPayload;

  if (decoded.type !== "temp") {
    throw new ExpiredTokenOrCode("Invalid token type");
  }

  if (expectedPurpose && decoded.purpose !== expectedPurpose) {
    throw new ExpiredTokenOrCode("Invalid token purpose");
  }

  return decoded;
}
