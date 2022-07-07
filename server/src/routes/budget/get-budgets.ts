import { Router } from "express";
import { RequestHandler } from 'express';
import { requiresAuth } from "../../middlewares/requires-auth";
import { Roles } from "../../types";

const router = Router();

router.get(
    '/get-budgets',
    requiresAuth({
        role: Roles.USER,
        emailVerified: true,
    }),
    (async (req, res, next) => {
        res.status(201).send({
            msg: "hi"
        })
    }) as RequestHandler
)

export { router as getBudgetsRoute };