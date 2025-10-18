// Provide a lightweight in-memory FakeRedis during tests to avoid connecting to a
// real Redis instance. For non-test environments, instantiate the real ioredis client.
if (process.env.NODE_ENV === 'test') {
  // Simple in-memory Redis-like store with expiry handling
  class FakeRedis {
    constructor() {
      this.store = new Map();
      this.timers = new Map();
    }

    async set(key, value, mode, ttlKey, ttl) {
      // Support calling signature: set(key, value) or set(key, value, 'EX', seconds)
      this.store.set(key, value);
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key));
        this.timers.delete(key);
      }
      if (mode && mode.toUpperCase() === 'EX' && typeof ttl === 'number') {
        const ms = ttl * 1000;
        const t = setTimeout(() => {
          this.store.delete(key);
          this.timers.delete(key);
        }, ms);
        this.timers.set(key, t);
      }
      return 'OK';
    }

    async get(key) {
      return this.store.has(key) ? this.store.get(key) : null;
    }

    async del(key) {
      if (this.timers.has(key)) {
        clearTimeout(this.timers.get(key));
        this.timers.delete(key);
      }
      return this.store.delete(key) ? 1 : 0;
    }

    on() {
      // no-op for tests
    }
  }

  module.exports = new FakeRedis();
} else {
  const { Redis } = require('ioredis');
  const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  });

  redis.on('connect', () => {
    console.log('Connected to Redis');
  });

  module.exports = redis;
}