import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js"; // Our security guard
import AnalysisController from "./analysis.controller.js";

const analysisRouter = Router();

// This endpoint is secure and creates a new analysis resource
analysisRouter.post(
  "/cv/:cvId", // The URL will include the ID of the CV to analyze
  protect, // Only logged-in users can access this
  AnalysisController.analyzeCv
);

export default analysisRouter;
