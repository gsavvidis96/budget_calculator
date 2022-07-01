import { Router } from "express";
import { body } from "express-validator";
import { validationError } from "../../middlewares/validation-error";
import { RequestHandler } from 'express';
import { HttpError, Roles } from '../../types';
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
            .notEmpty()
            .withMessage('password is required'),
    ],
    validationError,
    (async (req, res, next) => {
        //if email exists, throw an error
        let emailExists;

        try {
            emailExists = await auth.getUserByEmail(req.body.email);
        } catch (e) { }

        if (emailExists) {
            throw new HttpError("email already exists", 400);
        }

        //create user in firebase (with emailVerfied false by default)
        const firebaseUser = await auth.createUser({
            email: req.body.email,
            password: req.body.password
        })

        let user;

        try {
            //create user in database with matching firebase user id
            user = await User.create({
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                role: Roles.USER
            })
        } catch (e) {
            await auth.deleteUser(firebaseUser.uid)
            throw new Error();
        }

        // The new custom claims will propagate to the user's ID token the
        // next time a new one is issued.
        await auth.setCustomUserClaims(firebaseUser.uid, { role: Roles.USER });

        //create custom token
        const token = await auth.createCustomToken(firebaseUser.uid);

        res.status(201).send({
            user,
            firebaseUser,
            token
        })
    }) as RequestHandler
)

export { router as signupRoute };