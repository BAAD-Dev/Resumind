import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js"; // Our security guard
import AnalysisController from "./analysis.controller.js";
import upload from "../../middlewares/multer.middleware.js";

const analysisRouter = Router();

analysisRouter.post("/cv/:cvId", protect, AnalysisController.analyzeCv);
analysisRouter.post(
  "/guest/cv",
  upload.single("cv"),
  AnalysisController.analyzeGuestCv
);
analysisRouter.post("/match", protect, AnalysisController.analyzeJobMatch);

analysisRouter.get("/cv/:cvId", protect, AnalysisController.getAnalysesForCV);

export default analysisRouter;
