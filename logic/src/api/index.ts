import express from "express";

import MessageResponse from "../interfaces/MessageResponse";
import emojis from "./emojis";
import { userRouter } from "./user/user.routes";

const router = express.Router();

router.get<{}, MessageResponse>("/", (req, res) => {
    res.json({
        message: "API - 👋🌎🌍🌏",
    });
});

router.use("/emojis", emojis);
router.use("/users", userRouter);

export default router;
