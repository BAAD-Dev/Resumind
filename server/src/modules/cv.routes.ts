import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";

const cvRouter = Router();

// Define the CV upload route
// This route is now protected by our middleware.
cvRouter.post("/upload", protect, (req, res) => {
  // This is a placeholder controller. We will replace it later.
  // Because of the 'protect' middleware, we can safely access req.user here.
  res.json({
    message: `CV upload endpoint reached successfully!`,
    user: req.user,
  });
});

export default cvRouter;
