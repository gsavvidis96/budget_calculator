import { validationResult } from "express-validator"
import { RequestHandler } from 'express';
import { HttpError } from "../types";

export const validationError = (((req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError("Validation Error.", 422, errors.array()));
    }

    next();

}) as RequestHandler)