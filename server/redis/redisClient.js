import Redis from "ioredis"

const client = new Redis(`rediss://default:${process.env.REDIS_PASSWORD}@distinct-hyena-18765.upstash.io:6379`);

export default client
    