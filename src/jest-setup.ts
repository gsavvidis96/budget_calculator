import "dotenv/config";
import { sequelizeWrapper } from "./sequelize-wrapper";
import crypto from "crypto";
import { Client } from "pg";
import { RedisMemoryServer } from 'redis-memory-server';
import { redisWrapper } from "./redis-wrapper";

const randomDbName = crypto.randomBytes(10).toString('hex');

let redisServer: RedisMemoryServer;
let redisHost: string;
let redisPort: number;

const createDb = () => {
    return new Promise<void>(async (resolve, reject) => {
        const client = new Client({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: "127.0.0.1",
            database: process.env.DB_NAME,
            port: parseInt(process.env.TEST_DB_EXPOSED_PORT!)
        });

        await client.connect();

        client.query(`CREATE DATABASE "${randomDbName}"`, async (err, res) => {
            if (err) {
                return reject();
            }

            await client.end();

            resolve();
        });

    })
}

const createRedis = async () => {
    redisServer = new RedisMemoryServer();
    redisHost = await redisServer.getHost();
    redisPort = await redisServer.getPort();
}

beforeAll(async () => {
    await createDb();
    await createRedis();

    await sequelizeWrapper.connect("127.0.0.1", randomDbName, parseInt(process.env.TEST_DB_EXPOSED_PORT!), false);

    await redisWrapper.connect(redisHost, redisPort);
});

beforeEach(async () => {
    await sequelizeWrapper.client.sync({ force: true });

    await redisWrapper.client.flushAll();
});

afterAll(async () => {
    await sequelizeWrapper.disconnect();

    await redisWrapper.disconnect();
    await redisServer.stop();
})