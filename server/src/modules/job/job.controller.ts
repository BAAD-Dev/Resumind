import type { Request, Response, NextFunction } from "express";
import JobService from "./job.service.js";
import { createJobFromTextSchema } from "./job.types.js";

class JobController {
  async createJob(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = createJobFromTextSchema.parse(req.body);
      const user = req.user!; // Safe because of the 'protect' middleware

      const newJob = await JobService.createJobFromText(validatedData, user.id);
      res.status(201).json(newJob);
    } catch (err) {
      // Pass all errors to our central handler for a consistent response
      next(err);
    }
  }
}

export default new JobController();
