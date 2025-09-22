import { Router } from "express";
import { identifyUser, protect } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/multer.middleware.js";
import CVController from "./cv.controller.js";

const cvRouter = Router();

cvRouter.post(
  "/upload",
  identifyUser,
  upload.single("cv"),
  CVController.uploadCV
);

cvRouter.get("/", protect, CVController.getUserCVs);

cvRouter.delete("/:cvId", protect, CVController.deleteCV);

export default cvRouter;
