import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import JobController from "./job.controller.js";

const jobRouter = Router();

// This endpoint is for creating/saving a new job description
// It is protected, so only logged-in users can access it.
jobRouter.post("/", protect, JobController.createJob);
jobRouter.get("/", protect, JobController.getUserJobs);
jobRouter.delete("/:jobId", protect, JobController.deleteJob);

export default jobRouter;
