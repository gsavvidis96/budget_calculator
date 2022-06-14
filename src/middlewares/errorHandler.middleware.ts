import { ErrorRequestHandler } from "express";
import { HttpError } from "../types";

export const errorHandler = ((err, req, res, next) => {

    if (err instanceof HttpError) {
        return res.status(err.statusCode).send({ message: err.message, fields: err.fields });
    }

    res.status(500).send({ message: err.message });
}) as ErrorRequestHandler;