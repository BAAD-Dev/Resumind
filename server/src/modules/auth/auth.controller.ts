import type { Request, Response, NextFunction } from "express";
import AuthService from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.types.js";
import authService from "./auth.service.js";
import { env } from "../../config/env.js";

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

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        domain: process.env.NODE_ENV === "production" ? "resumind.live" : undefined,
      });

      res.json({ token });
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;

      const dataUser = await authService.getUserById(user.id);

      res.status(200).json({
        dataUser,
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.params;
      if (!token)
        throw new Error("Unique token not found", { cause: { status: 400 } });
      const result = await AuthService.verifyUserEmail(token);
      return res.redirect(`${env.frontendUrl}/login?verified=true`);
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
