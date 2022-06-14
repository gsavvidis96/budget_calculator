import { ValidationError } from "express-validator"
import { JwtPayload } from "jsonwebtoken";

export enum Providers {
    FACEBOOK = "FACEBOOK",
    GOOGLE = "GOOGLE",
    EMAIL = "EMAIL"
}

export enum Roles {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface DecodedToken extends JwtPayload {
    role: string,
    userId: string,
}

export class HttpError extends Error {
    constructor(public message: string, public statusCode: number, public fields?: ValidationError[]) {
        super(message);

        // only because we are extending a built in class
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}