import type { Request, Response, NextFunction } from "express";
import CVService from "./cv.service.js";

class CVController {
  async uploadCV(req: Request, res: Response, next: NextFunction) {
    try {
      // Multer attaches the file to req.file.
      // We also know req.user exists because the 'protect' middleware ran.
      const file = req.file;
      const user = req.user!; // The '!' asserts that user is not undefined

      if (!file) {
        throw new Error("No file uploaded.", { cause: { status: 400 } });
      }

      const result = await CVService.uploadCV(file, user);

      res.status(201).json({
        message: "CV uploaded successfully.",
        url: result.secure_url,
        cloudinaryId: result.public_id,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new CVController();
