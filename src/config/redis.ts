import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis-13556.c80.us-east-1-2.ec2.redns.redis-cloud.com',
  port: parseInt(process.env.REDIS_PORT || '13556', 10),
  password: process.env.REDIS_PASSWORD || 'IYbIUUHYwtO6IcfX8yXNpu3WgWCOaze0',
  enableAutoPipelining: true,
  // keep offline queue off for API safety
  enableOfflineQueue: false,
  reconnectOnError: (err) => {
    const targetErrors = ['READONLY', 'ECONNRESET'];
    if (targetErrors.some((msg) => err.message.includes(msg))) {
      console.warn('🔄 Reconnecting Redis due to error:', err.message);
      return true;
    }
    return false;
  },
  retryStrategy: (times) => {
    if (times > 10) {
      console.error('❌ Redis: Retry limit reached, giving up.');
      return null; // stop reconnecting
    }
    const delay = Math.min(times * 200, 2000); // backoff
    console.warn(`🔄 Redis reconnect attempt #${times}, retrying in ${delay}ms`);
    return delay;
  },
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('ready', () => console.log('🚀 Redis ready for commands'));
redis.on('error', (err) => console.error('❌ Redis error:', err.message));
redis.on('close', () => console.warn('⚠️ Redis connection closed'));
redis.on('reconnecting', (delay: number) => console.log(`🔄 Redis reconnecting in ${delay}ms`));

export default redis;
//  REDIS_HOST =redis-13556.c80.us-east-1-2.ec2.redns.redis-cloud.com
//  REDIS_PORT = 13556
//  REDIS_PASSWORD = IYbIUUHYwtO6IcfX8yXNpu3WgWCOaze0
