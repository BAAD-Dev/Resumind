import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js"; // Our security guard
import AnalysisController from "./analysis.controller.js";
import upload from "../../middlewares/multer.middleware.js";

const analysisRouter = Router();

// This endpoint is secure and creates a new analysis resource
analysisRouter.post(
  "/cv/:cvId", // The URL will include the ID of the CV to analyze
  protect, // Only logged-in users can access this
  AnalysisController.analyzeCv
);

analysisRouter.post(
  "/guest/cv",
  upload.single("cv"), // Use multer to handle the direct file upload
  AnalysisController.analyzeGuestCv
);

analysisRouter.post(
  "/match",
  protect, // This is a secure endpoint
  AnalysisController.analyzeJobMatch
);

export default analysisRouter;
