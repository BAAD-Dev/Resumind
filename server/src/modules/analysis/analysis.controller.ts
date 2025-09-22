import type { Request, Response, NextFunction } from "express";
import AnalysisService from "./analysis.service.js";

class AnalysisController {
  async analyzeCv(req: Request, res: Response, next: NextFunction) {
    try {
      const { cvId } = req.params;
      const user = req.user!; // Safe to use '!' because 'protect' middleware runs first

      if (!cvId) throw new Error("CV ID not found", { cause: { status: 404 } });

      const result = await AnalysisService.analyzeCvForUser(cvId, user.id);
      res.status(201).json(result);
    } catch (err) {
      // Pass all errors to our central handler
      next(err);
    }
  }

  async analyzeGuestCv(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      if (!file) {
        throw new Error("No file uploaded.", { cause: { status: 400 } });
      }

      const result = await AnalysisService.analyzeCvForGuest(file);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async analyzeJobMatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { cvId, jobId } = req.body;
      const user = req.user!;

      if (!cvId || !jobId) {
        throw new Error("Both cvId and jobId are required.", {
          cause: { status: 400 },
        });
      }

      const result = await AnalysisService.analyzeJobMatch(
        cvId,
        jobId,
        user.id
      );
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getAnalysesForCV(req: Request, res: Response, next: NextFunction) {
    try {
      const { cvId } = req.params;
      if (!cvId) throw new Error("CV ID is required");
      const user = req.user!;
      const analyses = await AnalysisService.getAnalysesForCV(cvId, user.id);
      res.status(200).json(analyses);
    } catch (err) {
      next(err);
    }
  }
}

export default new AnalysisController();
