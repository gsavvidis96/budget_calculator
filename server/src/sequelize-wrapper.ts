import { Sequelize } from 'sequelize-typescript'
import { Dialect } from "sequelize"

class SequelizeWrapper {
    private _client?: Sequelize;

    get client() {
        if (!this._client) {
            throw new Error("Cannot access Sequelize client before connecting");
        }

        return this._client;
    }

    async connect(host: string, dbName: string, port?: number, logging?: boolean) {
        this._client = new Sequelize
            (
                dbName,
                process.env.DB_USER!,
                process.env.DB_PASSWORD,
                {
                    host,
                    port,
                    dialect: process.env.DB_DIALECT as Dialect,
                    models: [__dirname + "/db/models/*.model.ts"],
                    logging: logging ? console.log : false
                }
            )

        await this._client.authenticate();
    }

    async disconnect() {
        await this._client?.close();

        this._client = undefined;
    }
}

export const sequelizeWrapper = new SequelizeWrapper();