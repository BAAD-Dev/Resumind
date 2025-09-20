import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import cvRouter from "../modules/cv/cv.routes.js";
import paymentsRouter from "../modules/payments/payments.routes.js";

const api = Router();
api.use("/auth", authRouter);
api.use("/cv", cvRouter);
api.use("/payments", paymentsRouter);

export default api;
