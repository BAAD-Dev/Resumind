import type { Request, Response, NextFunction } from "express";
import JobService from "./job.service.js";
import { createJobFromTextSchema } from "./job.types.js";

class JobController {
  async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createJobFromTextSchema.parse(req.body);
      const user = req.user!;

      const newJob = await JobService.createJobFromText(validatedData, user.id);
      res.status(201).json(newJob);
    } catch (err) {
      next(err);
    }
  }

  async getUserJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const jobs = await JobService.getJobsForUser(user.id);
      res.status(200).json(jobs);
    } catch (err) {
      next(err);
    }
  }

  async deleteJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobId } = req.params;
      if (!jobId)
        throw new Error("jobId not found", { cause: { status: 400 } });
      const user = req.user!;
      const result = await JobService.deleteJobForUser(jobId, user.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
  
}

export default new JobController();
