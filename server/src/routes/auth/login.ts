import { Router } from "express";
import { body } from "express-validator";
import { validationError } from "../../middlewares/validation-error";
import { RequestHandler } from 'express';
import { auth } from "../../firebase";
import { HttpError } from "../../types";
import axios from "axios";

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
            .trim()
            .notEmpty()
            .withMessage('password is required'),
    ],
    validationError,
    (async (req, res, next) => {
        const { email, password } = req.body;

        let user;

        try {
            //attemt to virtually login 
            user = await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_CLIENT_API_KEY}`,
                {
                    email,
                    password,
                }
            )
        } catch (e) {
            //if login is failed with these credentials throw 401 error
            throw new HttpError("unauthorized", 401);
        }

        //if user can login with these credentials, then create a custom token
        const token = await auth.createCustomToken(user.data.localId);

        //send the token in the response
        res.status(200).send({
            token
        })
    }) as RequestHandler
)

export { router as loginRoute };