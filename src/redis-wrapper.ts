import { createClient } from "redis";

class RedisWrapper {
    private _client = createClient({
        socket: {
            host: process.env.REDIS_HOST
        }
    });

    get client() {
        if (!this._client) {
            throw new Error("Cannot access Redis client before connecting");
        }

        return this._client;
    }

    async connect() {
        await this.client.connect();
    }
}

export const redisWrapper = new RedisWrapper();