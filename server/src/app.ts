import "dotenv/config";
import "express-async-errors";
import "./firebase";
import cors from "cors";
import express from "express";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import swaggerUI from "swagger-ui-express";

import { errorHandler } from "./middlewares/error-handler";
import { HttpError } from "./types";
import authRoutes from "./routes/auth";
import budgetRoutes from "./routes/budget";
import docs from "./docs";

dayjs.extend(utc);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/budgets', budgetRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

app.all('*', async (req, res) => {
    throw new HttpError("Route not found", 404);
});

app.use(errorHandler);

export { app };