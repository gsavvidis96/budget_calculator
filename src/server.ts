import { app } from "./app";
import { redisWrapper } from "./redis-wrapper";
import { sequelizeWrapper } from "./sequelize-wrapper";

const start = async () => {
    await sequelizeWrapper.connect(process.env.DB_HOST!, process.env.DB_NAME!);
    await redisWrapper.connect();

    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`);
    });
}

start();
