import type { Request, Response, NextFunction } from "express";
import AuthService from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.types.js";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const user = await AuthService.registerUser(validatedData);
      res.status(201).json({ message: "Register Succeed", user });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const token = await AuthService.loginUser(validatedData);
      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
