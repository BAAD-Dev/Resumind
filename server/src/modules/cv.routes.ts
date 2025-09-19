import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import CVController from "./cv.controller.js";

const cvRouter = Router();

cvRouter.post("/upload", protect, upload.single("cv"), CVController.uploadCV);

export default cvRouter;
