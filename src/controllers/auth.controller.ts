import { RequestHandler } from 'express';
import User from '../db/models/user.model';
import { Providers, Roles } from '../types';

export const signup: RequestHandler = async (req, res, next) => {
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
}
