import { RedisHelper } from "../config/redis.helpers";

const DEFAULT_CACHE_TTL = 5 * 60; // 5 mins

export class CacheService {
  static async cacheUserProfile(userId: string, userData: any): Promise<void> {
    const key = `cache:user:${userId}`;
    await RedisHelper.set(key, JSON.stringify(userData), DEFAULT_CACHE_TTL);
  }

  static async cacheUsers(userId: string, userData: any): Promise<void> {
    const key = `cache:users:${userId}`;
    await RedisHelper.set(key, JSON.stringify(userData), DEFAULT_CACHE_TTL);
  }

  static async getCachedUserProfile(userId: string): Promise<any | null> {
    const key = `cache:user:${userId}`;
    const data = await RedisHelper.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async invalidateUserCache(userId: string): Promise<void> {
    const key = `cache:user:${userId}`;
    await RedisHelper.delete(key);
  }

  static async cacheWithPattern(
    pattern: string,
    id: string,
    data: any,
    ttl: number = DEFAULT_CACHE_TTL
  ): Promise<void> {
    const key = `cache:${pattern}:${id}`;
    await RedisHelper.set(key, JSON.stringify(data), ttl);
  }

  static async getCachedByPattern(
    pattern: string,
    id: string
  ): Promise<any | null> {
    const key = `cache:${pattern}:${id}`;
    const data = await RedisHelper.get(key);
    return data ? JSON.parse(data) : null;
  }
}
