import { app } from "./app";
import { redisWrapper } from "./redis-wrapper";
import { sequelizeWrapper } from "./sequelize-wrapper";

const start = async () => {
    sequelizeWrapper.connect();
    await redisWrapper.connect();

    app.listen(process.env.PORT, () => {
        console.log(`Listening on port ${process.env.PORT}`);
    });
}

start();
