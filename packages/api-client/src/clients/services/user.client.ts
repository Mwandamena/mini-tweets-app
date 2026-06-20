import { User, UserProfile, ServiceResponse } from "../../types/types";
import Redis from "ioredis";
import { BaseServiceClient, logger } from "./base.client";

export class UserServiceClient extends BaseServiceClient {
  constructor(redis?: Redis) {
    super({
      serviceName: "UserService",
      baseURL:
        process.env.USER_SERVICE_URL || "http://localhost:3000/api/v1/users",
      timeout: 5000,
      cache: {
        enabled: !!redis,
        ttl: 300, // 5 minutes
        redis,
      },
    });
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const cacheKey = `user:${userId}`;

      const cached = await this.getCached<User>(cacheKey);
      if (cached) return cached;

      const response = await this.get<ServiceResponse<User>>(`/all/${userId}`);

      if (response.success) {
        await this.setCached(cacheKey, response.data);
        return response.data;
      }

      return null;
    } catch (error: any) {
      logger.error(`Failed to get user ${userId}:`, error.message);
      return null;
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const cacheKey = `user:username:${username.toLowerCase()}`;

      const cached = await this.getCached<User>(cacheKey);
      if (cached) return cached;

      const response = await this.get<ServiceResponse<User>>(
        `/username/${username}`
      );

      if (response.success) {
        await this.setCached(cacheKey, response.data);
        return response.data;
      }

      return null;
    } catch (error: any) {
      logger.error(
        `Failed to get user by username ${username}:`,
        error.message
      );
      return null;
    }
  }

  async userExists(userId: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      return user !== null;
    } catch {
      return false;
    }
  }

  async usersExist(userIds: string[]): Promise<Map<string, boolean>> {
    try {
      const response = await this.post<
        ServiceResponse<{ id: string; exists: boolean }[]>
      >("/bulk/exists", { userIds });

      const existsMap = new Map<string, boolean>();
      if (response.success) {
        response.data.forEach((item) => {
          existsMap.set(item.id, item.exists);
        });
      }

      return existsMap;
    } catch (error: any) {
      logger.error("Failed to check users existence:", error.message);
      return new Map();
    }
  }

  async getUsersByIds(userIds: string[]): Promise<Map<string, UserProfile>> {
    try {
      const uniqueIds = [...new Set(userIds)];
      const userMap = new Map<string, UserProfile>();

      // Check cache for all users
      const uncachedIds: string[] = [];
      for (const userId of uniqueIds) {
        const cached = await this.getCached<UserProfile>(`user:${userId}`);
        if (cached) {
          userMap.set(userId, cached);
        } else {
          uncachedIds.push(userId);
        }
      }

      // Fetch uncached users in batch
      if (uncachedIds.length > 0) {
        const response = await this.post<ServiceResponse<UserProfile[]>>(
          "/batch/id",
          { userIds: uncachedIds }
        );

        if (response.success) {
          for (const user of response.data) {
            await this.setCached(`user:${user.id}`, user);
            userMap.set(user.id, user);
          }
        }
      }

      return userMap;
    } catch (error: any) {
      logger.error("Failed to get users batch:", error.message);
      return new Map();
    }
  }

  async getUsersByUsernames(
    usernames: string[]
  ): Promise<Map<string, UserProfile>> {
    try {
      const response = await this.post<ServiceResponse<UserProfile[]>>(
        "/batch/username",
        { usernames: usernames.map((u) => u.toLowerCase()) }
      );

      const userMap = new Map<string, UserProfile>();
      if (response.success) {
        response.data.forEach((user) => {
          userMap.set(user.username.toLowerCase(), user);
        });
      }

      return userMap;
    } catch (error: any) {
      console.error("Failed to get users by usernames:", error.message);
      return new Map();
    }
  }

  async invalidateUserCache(userId: string): Promise<void> {
    await this.invalidateCache(`user:${userId}`);
    await this.invalidateCache(`user:username:*`);
  }
}
