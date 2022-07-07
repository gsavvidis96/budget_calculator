import { Router } from "express";
import { RequestHandler } from 'express';
import { auth } from "../../firebase";
import User from "../../db/models/user.model";
import { getProviderByValue, Roles } from "../../types";

const router = Router();

router.post(
    '/provider-login',
    (async (req, res, next) => {

        //verify idToken from request body
        //NOTE: this idToken is from the signedin user with the client sdk's methods. 
        //when we validate and sync user with db, we want to re-login with custom token.
        const decoded = await auth.verifyIdToken(req.body.idToken);

        //check if user exists in database
        const user = await User.findByPk(decoded.uid);

        if (!user) {
            try {
                //create user in database
                await User.create({
                    id: decoded.uid,
                    email: decoded.email!,
                    provider: getProviderByValue(decoded.firebase.sign_in_provider),
                    role: Roles.USER
                })
            } catch (e) {
                // if this operation fails, delete the firebase user and throw an error
                await auth.deleteUser(decoded.uid)
                throw new Error();
            }
        }

        //add custom claims
        await auth.setCustomUserClaims(decoded.uid, { role: Roles.USER });

        //create custom token
        const token = await auth.createCustomToken(decoded.uid);

        //send the token in the response
        res.status(201).send({
            token
        })
    }) as RequestHandler
)

export { router as providerLoginRoute };