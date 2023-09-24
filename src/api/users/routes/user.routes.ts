import express from "express";
import {validation} from "../../../handlers";
import {getUsers} from "../handlers";
import {authGuard} from "../../auth/guards";

export const userRouter = express.Router();

// /api/users
userRouter.get(
  '/',
  authGuard,
  getUsers,
);