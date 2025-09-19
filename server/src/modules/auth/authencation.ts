import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../db/prisma.js";
import { hashPassword, compareHash } from "../../utils/bcryptjs.js";
import { createToken } from "../../utils/jwt.js";
import { z } from "zod";

const httpError = (message: string, status = 500, details?: unknown) =>
    new Error(message, { cause: { status, details } as { status?: number; details?: unknown } });

const registerSchema = z.object({
    name: z.string().min(1),
    username: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success) {
            throw httpError("ValidationError", 400, parsed.error.flatten());
        }

        const { name, username, email, password } = parsed.data;

        const existsUsername = await prisma.user.findUnique({ where: { username } });
        if (existsUsername) {
            throw httpError("Username already in use", 409);
        }

        const existsEmail = await prisma.user.findUnique({ where: { email } });
        if (existsEmail) {
            throw httpError("Email already in use", 409);
        }

        const hashed = await hashPassword(password);
        const user = await prisma.user.create({ data: { name, username, email, password: hashed } });

        res.status(201).json({
            message: "Register Succeed",
            user: { id: user.id, name: user.name, username: user.username, email: user.email },
        });
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            throw httpError("ValidationError", 400, parsed.error.flatten());
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw httpError("Invalid Email or Password", 401);
        }

        const ok = await compareHash(password, user.password);
        if (!ok) {
            throw httpError("Invalid Email or Password", 401);
        }

        const token = createToken({ id: user.id, username: user.username, email: user.email });
        res.json({
            token
        });
    } catch (err) {
        next(err);
    }
};
