import { createClient, RedisClientType } from "redis";

class RedisWrapper {
    private _client?: RedisClientType;

    get client() {
        if (!this._client) {
            throw new Error("Cannot access Redis client before connecting");
        }

        return this._client;
    }

    async connect(host: string, port?: number) {
        this._client = createClient({
            socket: {
                host,
                port
            }
        });

        await this.client.connect();
    }

    async disconnect() {
        await this._client?.disconnect();

        this._client = undefined;
    }
}

export const redisWrapper = new RedisWrapper();