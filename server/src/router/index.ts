import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";

const api = Router();
api.use("/auth", authRouter);

export default api;
