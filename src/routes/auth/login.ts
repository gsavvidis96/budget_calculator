import { Router } from "express";
import { body } from "express-validator";
import { validationError } from "../../middlewares/validation-error";
import { RequestHandler } from 'express';

const router = Router();

router.post(
    '/login',
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
        res.status(200).send({
            msg: "hi"
        })
    }) as RequestHandler
)

export { router as loginRoute };