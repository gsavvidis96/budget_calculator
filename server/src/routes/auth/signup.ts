import { Router } from "express";
import { body } from "express-validator";
import { validationError } from "../../middlewares/validation-error";
import { RequestHandler } from 'express';
import { HttpError, Providers, Roles } from '../../types';
import { auth } from "../../firebase";
import User from "../../db/models/user.model";

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
            .trim()
            .notEmpty()
            .withMessage('password is required'),
    ],
    validationError,
    (async (req, res, next) => {
        const { email, password } = req.body;

        //if email exists, throw an error
        let emailExists;

        try {
            emailExists = await auth.getUserByEmail(email);
        } catch (e) { }

        if (emailExists) {
            throw new HttpError("email already exists", 400);
        }

        //create user in firebase (with emailVerfied false by default)
        const user = await auth.createUser({
            email,
            password
        })

        try {
            //create user in database with matching firebase user id
            await User.create({
                id: user.uid,
                email: user.email!,
                role: Roles.USER,
                provider: Providers.PASSWORD
            })
        } catch (e) {
            // if this operation fails, delete the firebase user and throw an error
            await auth.deleteUser(user.uid)
            throw new Error();
        }

        //add custom claims
        await auth.setCustomUserClaims(user.uid, { role: Roles.USER });

        //create custom token
        const token = await auth.createCustomToken(user.uid);

        //send the token in the response
        res.status(201).send({
            token
        })
    }) as RequestHandler
)

export { router as signupRoute };