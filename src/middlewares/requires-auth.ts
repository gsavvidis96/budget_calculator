import { RequestHandler } from "express";
import { DecodedToken, HttpError, Roles } from "../types";
import { verify } from "jsonwebtoken"
import { redisWrapper } from "../redis-wrapper";

export const requiresAuth = (role: Roles, requiresEmailVerified: boolean) => {
    return (async (req, res, next) => {

        const token = req.headers.authorization?.split(" ")[1]; //extract access token from auth header

        //if token does not exist then throw unauthorized error
        if (!token) {
            throw new HttpError("unauthorized", 401);
        }

        let decoded;

        //decode token
        try {
            decoded = verify(token, process.env.JWT_SECRET!) as DecodedToken;
        } catch (e) {
            throw new HttpError("unauthorized", 401);
        }

        //if decoded token's role is not the same as the provided role, throw forbidden error
        if (decoded.role !== role) {
            throw new HttpError("you have not access in this resource", 403);
        }

        //if provided emailVerified is true and decoded emailVerified is false then throw forbidden error
        if (requiresEmailVerified && !decoded.emailVerified) {
            throw new HttpError("unauthorized", 403);
        }

        //try to find user's token in redis
        const blacklisted = await redisWrapper.client.get(`blacklist:${decoded.userId}:${decoded.iat}`);

        //if it is blacklisted (meaning the user logged out using this token), then throw unauthorized error 
        if (blacklisted) {
            throw new HttpError("unauthorized", 401);
        }

        //if all above condition pass, then add user's info in req.user
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        }

        //proceed
        next();

    }) as RequestHandler
}