import express from "express";
import {createUserByEmailSchema} from "../schemas";
import {validation} from "../../../handlers";
import {createUserByEmail} from "../handlers";

export const userRouter = express.Router();

// /api/users
userRouter.post(
    '/create-by-email',
    createUserByEmailSchema,
    validation,
    createUserByEmail
);
