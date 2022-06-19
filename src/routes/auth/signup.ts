import { Router } from "express";
import { body } from "express-validator";
import { validationError } from "../../middlewares/validationError";
import { RequestHandler } from 'express';
import { Providers, Roles } from '../../types';
import User from '../../db/models/user.model';

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
        const createdUser = await User.create({
            email: req.body.email,
            createdWith: Providers.FACEBOOK,
            role: Roles.USER,
            providerId: "123",
        })

        const foundUser = await User.findAll();

        res.status(201).send({
            createdUser,
            foundUser
        })
    }) as RequestHandler
)

export { router as signupRoute };