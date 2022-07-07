import { ValidationError } from "express-validator"
import { JwtPayload } from "jsonwebtoken";

export enum Providers {
    FACEBOOK = "FACEBOOK",
    GOOGLE = "GOOGLE",
    PASSWORD = "PASSWORD"
}

export const getProviderByValue = (value: string): Providers => {
    if (value == 'google.com') return Providers.GOOGLE;
    if (value == 'facebook.com') return Providers.FACEBOOK;
    if (value == 'password') return Providers.PASSWORD;

    throw new Error();
}

export enum Roles {
    USER = "USER",
    ADMIN = "ADMIN"
}

export interface tokenPayload {
    role: string,
    userId: string,
    emailVerified: boolean
}

export interface DecodedToken extends JwtPayload {
    role: string,
    userId: string,
    emailVerified: boolean
}

export class HttpError extends Error {
    constructor(public message: string, public statusCode: number, public fields?: ValidationError[]) {
        super(message);

        // only because we are extending a built in class
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string,
                role: Roles,
                emailVerified: boolean
            };
        }
    }
}