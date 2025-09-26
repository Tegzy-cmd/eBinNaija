import redis from '../config/redis';

class RedisService {
  private prefix = process.env.REDIS_PREFIX || 'app'; // namespace

  private withPrefix(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async setValue(key: string, value: unknown, ttl?: number): Promise<void> {
    const namespacedKey = this.withPrefix(key);
    const data = typeof value === 'string' ? value : JSON.stringify(value);

    try {
      if (ttl) {
        await redis.set(namespacedKey, data, 'EX', ttl);
      } else {
        await redis.set(namespacedKey, data);
      }
    } catch (err) {
      console.error(`Redis setValue error:`, err);
    }
  }

  async getValue<T = string>(key: string): Promise<T | null> {
    const namespacedKey = this.withPrefix(key);

    try {
      const data = await redis.get(namespacedKey);
      if (!data) return null;

      try {
        return JSON.parse(data) as T;
      } catch {
        return data as T;
      }
    } catch (err) {
      console.error(`Redis getValue error:`, err);
      return null;
    }
  }

  async deleteKey(key: string): Promise<number> {
    try {
      return await redis.del(this.withPrefix(key));
    } catch (err) {
      console.error(`Redis deleteKey error:`, err);
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(this.withPrefix(key));
      return result === 1;
    } catch (err) {
      console.error(`Redis exists error:`, err);
      return false;
    }
  }

  async increment(key: string): Promise<number> {
    try {
      return await redis.incr(this.withPrefix(key));
    } catch (err) {
      console.error(`Redis increment error:`, err);
      return 0;
    }
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      const result = await redis.expire(this.withPrefix(key), ttl);
      return result === 1;
    } catch (err) {
      console.error(`Redis expire error:`, err);
      return false;
    }
  }

  async multi(commands: [string, ...unknown[]][]) {
    try {
      return await redis.multi(commands).exec();
    } catch (err) {
      console.error(`Redis multi error:`, err);
      return null;
    }
  }

  async setJSON(key: string, obj: Record<string, any>, ttl?: number) {
    return this.setValue(key, JSON.stringify(obj), ttl);
  }

  async getJSON<T extends object>(key: string): Promise<T | null> {
    const raw = await this.getValue<string>(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  /**
   * Get from cache or set new value using a fetcher function
   * @param key Redis key
   * @param fetcher Function to fetch data if not in cache
   * @param ttl Time-to-live in seconds (default: 1 hour)
   */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl: number = 3600): Promise<T> {
    const cached = await this.getValue<T>(key);
    if (cached) return cached;

    const freshData = await fetcher();
    await this.setValue(key, freshData, ttl);
    return freshData;
  }
}

export default new RedisService();
