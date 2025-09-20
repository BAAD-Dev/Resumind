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
}

export default new AnalysisController();
