import type { Request, Response, NextFunction } from "express";
import AuthService from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.types.js";
import authService from "./auth.service.js";

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
        sameSite: "strict",
        path: "/",
      });

      res.json({ token });
    } catch (err) {
      next(err);
    }
  }

  async userById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!

      const dataUser = await authService.userById(user.id)

      res.status(200).json({
        dataUser
      })
    } catch (err) {
      next(err)
    }
  }
}

export default new AuthController();
