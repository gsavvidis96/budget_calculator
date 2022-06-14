import "dotenv/config";
import "express-async-errors";
import cors from "cors";
import express from "express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HttpError } from "./types";
import { authRoutes } from "./routes/auth.routes";

// TODO LOGGER, SWAGGER, DB BACKUP

dayjs.extend(utc);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.all('*', async (req, res) => {
    throw new HttpError("Route not found", 404);
});

app.use(errorHandler);

export { app };