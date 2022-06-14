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

    connect() {
        this._client = new Sequelize
            (
                process.env.DB_NAME!,
                process.env.DB_USER!,
                process.env.DB_PASSWORD,
                {
                    host: process.env.DB_HOST,
                    dialect: process.env.DB_DIALECT as Dialect,
                    models: [__dirname + "/db/models/*.model.ts"]
                }
            )
    }
}

export const sequelizeWrapper = new SequelizeWrapper();