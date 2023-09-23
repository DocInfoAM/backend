import express from "express";
import {validation} from "../../../handlers";
import {registerByEmailSchema} from "../schemas";
import {loginByEmail, registerByEmail} from "../handlers";

export const authRouter = express.Router();

// /api/auth
authRouter.post(
    '/register-by-email',
    registerByEmailSchema,
    validation,
    registerByEmail
);

authRouter.post(
  '/login-by-email',
  registerByEmailSchema,
  validation,
  loginByEmail
);