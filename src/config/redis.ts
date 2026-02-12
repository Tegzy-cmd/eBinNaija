import Redis from 'ioredis';

const redis = new Redis({
  host: "redis-16839.c341.af-south-1-1.ec2.cloud.redislabs.com",  // Default to localhost if not set
  port: 16839, // Default to port 6379 if not set
  password: "SjIcjY0zI6SU6jYXtCexotpL8I4QZ9lt",
  enableAutoPipelining: true,
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
