import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST as string,
  port: process.env.REDIS_PORT as unknown as number,
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('❌ Redis error', err));

export default redis;
