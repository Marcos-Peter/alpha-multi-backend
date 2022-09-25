import * as redis from 'redis';

class RedisConnection
{
    public static readonly redisConn = redis.createClient();
}

export { RedisConnection };
