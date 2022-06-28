import { Router } from "express";
import { body } from "express-validator";
import { validationError } from "../../middlewares/validation-error";
import { RequestHandler } from 'express';
import { HttpError, Providers, Roles } from '../../types';
import User from '../../db/models/user.model';
import bcrypt from "bcrypt";
import crypto from "crypto";
import { redisWrapper } from "../../redis-wrapper";
import dayjs from "dayjs";
import { generateTokens } from "./generate-tokens";

const router = Router();

router.post(
    '/signup',
    [
        body("email")
            .notEmpty()
            .withMessage('email is required')
            .bail()
            .isEmail()
            .withMessage('must be a valid email format'),
        body("password")
            .notEmpty()
            .withMessage('password is required'),
    ],
    validationError,
    (async (req, res, next) => {
        //if email exists, throw an error
        const found = await User.findOne({
            where: {
                email: req.body.email
            }
        });

        if (found) {
            throw new HttpError("email already exists", 400)
        }

        //create user with emailVerfied false
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await User.create({
            email: req.body.email,
            password: hashedPassword,
            createdWith: Providers.EMAIL,
            role: Roles.USER,
            emailVerified: false
        })

        //generate random string for email verification and store it in redis for 6 hours.
        const verificationToken = crypto.randomBytes(16).toString('hex');

        redisWrapper.client.set
            (
                `verification:${user.id}`,
                verificationToken,
                {
                    PX: dayjs().add(6, "hours").diff(dayjs(), "milliseconds")
                }
            )

        //send email with verification code
        //TODO

        // generate access token
        const { accessToken } = await generateTokens(user.id, user.role, user.emailVerified);

        res.status(201).send({
            user,
            accessToken
        })
    }) as RequestHandler
)

export { router as signupRoute };