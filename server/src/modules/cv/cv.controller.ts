import type { Request, Response, NextFunction } from "express";
import CVService from "./cv.service.js";

class CVController {
  async uploadCV(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      const user = req.user; // This is either the user payload or undefined

      if (!file) {
        throw new Error("No file uploaded.", { cause: { status: 400 } });
      }

      // Call the service to handle both upload and DB save
      const newCvRecord = await CVService.handleUploadAndSave(file, user);

      res.status(201).json(newCvRecord);
    } catch (err) {
      next(err);
    }
  }
  async getUserCVs(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const cvs = await CVService.getCVsForUser(user.id);
      res.status(200).json(cvs);
    } catch (error) {
      next(error);
    }
  }

  async deleteCV(req: Request, res: Response, next: NextFunction) {
    try {
      const { cvId } = req.params;
      if (!cvId) throw new Error("No cvId found", { cause: { status: 400 } });
      const user = req.user!;
      const result = await CVService.deleteCVforUser(cvId, user.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new CVController();
