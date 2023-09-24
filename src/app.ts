import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import * as middlewares from "./middlewares";
import api from "./api";
import { initDatabase } from "./db";
import cookieParser from "cookie-parser";
import {validation} from "./handlers";

require("dotenv").config();

initDatabase();

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser())
app.use(validation)

app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
