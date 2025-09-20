import { Router } from "express";
import authRouter from "../modules/auth/auth.routes.js";
import cvRouter from "../modules/cv/cv.routes.js";
import analysisRouter from "../modules/analysis/analysis.routes.js";

const api = Router();
api.use("/auth", authRouter);
api.use("/cv", cvRouter);
api.use("/analysis", analysisRouter);

export default api;
