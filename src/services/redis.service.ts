import redis from '../config/redis';

class RedisService {
  /**
   * Set a value with optional expiration
   * @param key Redis key
   * @param value Value to store (string | object)
   * @param ttl Time-to-live in seconds
   */
  async setValue(key: string, value: unknown, ttl?: number): Promise<void> {
    const data = typeof value === 'string' ? value : JSON.stringify(value);

    if (ttl) {
      await redis.set(key, data, 'EX', ttl);
    } else {
      await redis.set(key, data);
    }
  }

  /**
   * Get a value by key
   * @param key Redis key
   * @returns Parsed JSON if possible, otherwise raw string | null
   */
  async getValue<T = string>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    if (!data) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data as T;
    }
  }

  /**
   * Delete a key
   * @param key Redis key
   * @returns number of deleted keys
   */
  async deleteKey(key: string): Promise<number> {
    return await redis.del(key);
  }

  /**
   * Check if a key exists
   * @param key Redis key
   * @returns true if exists
   */
  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  }

  /**
   * Increment a key (for rate limiting, counters, etc.)
   * @param key Redis key
   */
  async increment(key: string): Promise<number> {
    return await redis.incr(key);
  }

  /**
   * Set expiration on an existing key
   * @param key Redis key
   * @param ttl Time-to-live in seconds
   */
  async expire(key: string, ttl: number): Promise<boolean> {
    const result = await redis.expire(key, ttl);
    return result === 1;
  }
}

export default new RedisService();
