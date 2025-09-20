import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import paymentsRouter from "../modules/payments/payments.routes.js";
import analysisRouter from "../modules/analysis/analysis.routes.js";
import cvRouter from "../modules/cv/cv.routes.js";

const api = Router();
api.use("/auth", authRouter);
api.use("/cv", cvRouter);
api.use("/payments", paymentsRouter);
api.use("/analysis", analysisRouter);

export default api;
