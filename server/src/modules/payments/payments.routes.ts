import { Router } from "express";
import { createPayment, midtransWebhook } from "./payments.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const paymentsRouter = Router();

paymentsRouter.post("/create", protect, createPayment);
paymentsRouter.post("/webhook", midtransWebhook);

export default paymentsRouter;