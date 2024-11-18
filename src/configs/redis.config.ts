import { CacheModuleOptions } from '@nestjs/cache-manager';

export const getRedisConfig = (): CacheModuleOptions => ({
  isGlobal: true,
  store: require('cache-manager-redis-store'),
  host: process.env.REDIS_HOST || 'localhost',
  port: +process.env.REDIS_PORT || 6379,
  ttl: +process.env.REDIS_TTL || 10,
  max: +process.env.REDIS_MAX || 10,
});
