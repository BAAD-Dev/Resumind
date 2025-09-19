import jwt from "jsonwebtoken"
import { env } from "../config/env.js";

export type JWTPayload = { id: string; username: string; email: string };

export const createToken = (payload: JWTPayload) =>
    jwt.sign(payload, env.jwtSecret);

export const readPayload = (token: string) =>
    jwt.verify(token, env.jwtSecret) as JWTPayload;
