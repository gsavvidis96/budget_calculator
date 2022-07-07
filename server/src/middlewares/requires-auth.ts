import { RequestHandler } from "express";
import { HttpError, Roles } from "../types";
import { auth } from "../firebase";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

export const requiresAuth = (options: { role: Roles, emailVerified: boolean }) => {
    return (async (req, res, next) => {

        const token = req.headers.authorization?.split(" ")[1]!; //extract access token from auth header

        //if token does not exist then throw unauthorized error
        if (!token) {
            throw new HttpError("unauthorized", 401);
        }

        let decoded: DecodedIdToken;

        //decode token
        try {
            decoded = await auth.verifyIdToken(token);

            if (!decoded.role) throw new Error();
        } catch (e) {
            // if cannot decode token or the decoded token has no role then throw unauthorized error
            throw new HttpError("unauthorized", 401);
        }

        //if provided options do not match with the decoded token's attributes then throw forbidden error
        if (
            (options.role != decoded.role) ||
            (options.emailVerified != decoded.email_verified)
        ) {
            throw new HttpError("forbidden", 403);
        }

        //set req.user
        req.user = {
            userId: decoded.uid,
            role: decoded.role,
            emailVerified: decoded.email_verified!
        }

        next();
    }) as RequestHandler
}