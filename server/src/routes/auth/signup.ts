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
        const firebaseUser = await auth.createUser({
            email,
            password
        })

        let createdUser

        try {
            //create user in database with matching firebase user id
            createdUser = await User.create({
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                role: Roles.USER
            })
        } catch (e) {
            // if this operation fails, delete the firebase user and throw an error
            await auth.deleteUser(firebaseUser.uid)
            throw e;
        }

        //add custom claims
        await auth.setCustomUserClaims(firebaseUser.uid, { role: Roles.USER });

        //create custom token
        const token = await auth.createCustomToken(firebaseUser.uid);

        //send the token in the response
        res.status(201).send({
            token,
            role: createdUser.role,
            emailVerified: firebaseUser.emailVerified
        })
    }) as RequestHandler
)

export { router as signupRoute };