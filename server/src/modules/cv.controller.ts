import type { Request, Response, NextFunction } from "express";
import CVService from "./cv.service.js";

class CVController {
  async uploadCV(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      const user = req.user!; 

      if (!file) {
        throw new Error("No file uploaded.", { cause: { status: 400 } });
      }

      // Call the service to upload the file
      const uploadResult = await CVService.uploadCV(file, user);

      // Return a success message with the viewable URL and original filename
      res.status(201).json({
        message: "CV uploaded successfully.",
        url: uploadResult.secure_url,
        originalname: file.originalname,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new CVController();

