import redis from "../../config/redis";

export class RedisHelper {
  // Set value with expiration
  static async set(
    key: string,
    value: string,
    expirationSeconds?: number
  ): Promise<void> {
    if (expirationSeconds) {
      await redis.setex(key, expirationSeconds, value);
    } else {
      await redis.set(key, value);
    }
  }

  // Get value
  static async get(key: string): Promise<string | null> {
    return await redis.get(key);
  }

  // Delete key
  static async delete(key: string): Promise<void> {
    await redis.del(key);
  }

  // Check if key exists
  static async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  }

  // Set hash (object)
  static async setHash(key: string, data: Record<string, any>): Promise<void> {
    await redis.hset(key, data);
  }

  // Get hash (object)
  static async getHash(key: string): Promise<Record<string, string>> {
    return await redis.hgetall(key);
  }

  // Set expiration on existing key
  static async expire(key: string, seconds: number): Promise<void> {
    await redis.expire(key, seconds);
  }

  // Add to set
  static async addToSet(key: string, value: string): Promise<void> {
    await redis.sadd(key, value);
  }

  // Remove from set
  static async removeFromSet(key: string, value: string): Promise<void> {
    await redis.srem(key, value);
  }

  // Get all set members
  static async getSet(key: string): Promise<string[]> {
    return await redis.smembers(key);
  }

  // Check if member in set
  static async isInSet(key: string, value: string): Promise<boolean> {
    const result = await redis.sismember(key, value);
    return result === 1;
  }

  // Increment counter
  static async increment(key: string): Promise<number> {
    return await redis.incr(key);
  }

  // Decrement counter
  static async decrement(key: string): Promise<number> {
    return await redis.decr(key);
  }

  static async ttl(key: string): Promise<number> {
    return await redis.ttl(key);
  }
}
