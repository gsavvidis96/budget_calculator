import { Router } from "express";
import { RequestHandler } from 'express';
import { auth } from "../../firebase";
import User from "../../db/models/user.model";
import { HttpError, Providers, Roles } from "../../types";
import { body } from "express-validator";
import { validationError } from "../../middlewares/validation-error";
import axios from "axios";

const router = Router();

router.post(
    '/provider-login',
    [
        body("providerToken")
            .notEmpty()
            .withMessage('providerToken is required'),
        body("provider")
            .notEmpty()
            .withMessage('provider is required')
            .bail()
            .isIn(Object.values(Providers))
            .withMessage("possible provider values are 'GOOGLE' or 'FACEBOOK'")
    ],
    validationError,
    (async (req, res, next) => {
        const { providerToken, provider } = req.body;

        let firebaseUser;

        try {
            const tokenKey = provider === Providers.GOOGLE ? 'id_token' : 'access_token';
            //id_token for google and access_token for facebook;

            //attemt to virtually login 
            //if it is the first time, a user with this provider is created.
            firebaseUser = await axios.post(
                `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${process.env.FIREBASE_CLIENT_API_KEY}`,
                {
                    postBody: `${tokenKey}=${providerToken}&providerId=${provider}`,
                    requestUri: "http://localhost"
                }
            )
        } catch (e) {
            //if login is failed throw 401 error
            throw new HttpError("unauthorized", 401);
        }

        //check if user exists in database
        const user = await User.findByPk(firebaseUser.data.localId);

        if (!user) {
            //if user does not exist in database, create the user.
            try {
                //create user in database
                await User.create({
                    id: firebaseUser.data.localId,
                    email: firebaseUser.data.email,
                    role: Roles.USER
                })

                // make email verified true... for google is true by default, for facebook it is false
                await auth.updateUser(firebaseUser.data.localId, { emailVerified: true })
            } catch (e) {
                // if this operation fails, delete the firebase user and throw an error
                await auth.deleteUser(firebaseUser.data.localId)
                throw e;
            }
        }

        //add custom claims
        await auth.setCustomUserClaims(firebaseUser.data.localId, { role: Roles.USER });

        //create custom token
        const token = await auth.createCustomToken(firebaseUser.data.localId);

        //send the token in the response
        res.status(201).send({
            token
        })
    }) as RequestHandler
)

export { router as providerLoginRoute };