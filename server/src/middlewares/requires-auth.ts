import { RequestHandler } from "express";
import { HttpError, Roles } from "../types";
import { auth } from "../firebase";

export const requiresAuth = (role: Roles, requiresEmailVerified: boolean) => {
    return (async (req, res, next) => {

        const token = req.headers.authorization?.split(" ")[1]!; //extract access token from auth header

        //if token does not exist then throw unauthorized error
        if (!token) {
            throw new HttpError("unauthorized", 401);
        }

        let decoded;

        //decode token
        try {
            decoded = await auth.verifyIdToken(token);
        } catch (e) {
            throw new HttpError("unauthorized", 401);
        }

        //if decoded token's role is not the same as the provided role, throw forbidden error
        if (decoded.role !== role) {
            throw new HttpError("you have not access in this resource", 403);
        }

        //if provided emailVerified is true and decoded email_verified is false then throw forbidden error
        if (requiresEmailVerified && !decoded.email_verified) {
            throw new HttpError("must have email_verified: true", 403);
        }

        req.user = {
            userId: decoded.uid,
            role: decoded.role
        }

        next();
    }) as RequestHandler
}