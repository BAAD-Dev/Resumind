import { Router } from "express";
import AuthController from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", AuthController.register);
authRouter.post("/login", AuthController.login);
authRouter.get("/userLogin", protect, AuthController.userById)

export default authRouter;
