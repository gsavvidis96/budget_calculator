import { Router } from "express";
import { body } from "express-validator";
import { signup } from "../controllers/auth.controller";
import { validationError } from "../middlewares/validationError.middleware";

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
    signup
)

export { router as authRoutes };