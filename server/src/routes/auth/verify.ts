import { Router } from "express";
import { param } from "express-validator";
import { validationError } from "../../middlewares/validation-error";
import { RequestHandler } from 'express';
import { HttpError, Roles } from '../../types';
import User from '../../db/models/user.model';
import { redisWrapper } from "../../redis-wrapper";
import { requiresAuth } from "../../middlewares/requires-auth";
import { generateTokens } from "./generate-tokens";

const router = Router();

router.get('/verify/:token',
    [
        param("token")
            .notEmpty()
            .withMessage('token is required')
    ],
    validationError,
    requiresAuth(Roles.USER, false),
    (async (req, res, next) => {

        //get verification token from redis
        const token = await redisWrapper.client.get(`verification:${req.user?.userId}`);

        //if token does not exist or is not the same as one provided
        if (!token || token !== req.params.token) {
            throw new HttpError("token is invalid", 400);
        }

        //find user
        const user = await User.findByPk(req.user?.userId)!;

        //if user does not exist, throw 404 error
        if (!user) {
            throw new HttpError("user is not found", 404);
        }

        if (user.emailVerified) {
            throw new HttpError("user is already verified", 400);
        }

        //make emailVerified = true
        user.emailVerified = true;

        //update the user
        await user.save();

        //generate new tokens
        const { accessToken, refreshToken } = await generateTokens(user.id, user.role, user.emailVerified);

        res.status(200).send({
            user,
            accessToken,
            refreshToken
        })
    }) as RequestHandler
)

export { router as verifyRoute };