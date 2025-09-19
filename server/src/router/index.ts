import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import cvRouter from "../modules/cv.routes.js";

const api = Router();
api.use("/auth", authRouter);
api.use("/cv",cvRouter);

export default api;
