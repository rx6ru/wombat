import { Redis } from '@upstash/redis';
import { config } from '../config/env.js';

export const redis = new Redis({
  url: config.redis.restUrl,
  token: config.redis.restToken,
});
