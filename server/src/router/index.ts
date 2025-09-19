import { Router } from "express";
import { login, register } from "../modules/auth/authencation.js";

const api = Router();
api.post("/login", login);
api.post("/register", register);

export default api;
