import "dotenv/config";
import { sequelizeWrapper } from "./sequelize-wrapper";
import crypto from "crypto";
import { Client } from "pg";

const randomDbName = crypto.randomBytes(10).toString('hex');

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

beforeAll(async () => {
    await createDb();

    await sequelizeWrapper.connect("127.0.0.1", randomDbName, parseInt(process.env.TEST_DB_EXPOSED_PORT!), false);
});

beforeEach(async () => {
    await sequelizeWrapper.client.sync({ force: true });
});

afterAll(async () => {
    await sequelizeWrapper.disconnect();
})