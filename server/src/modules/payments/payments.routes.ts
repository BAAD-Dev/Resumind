import { Router } from "express";
import { createPayment, midtransWebhook } from "./payments.controller.js";

const paymentsRouter = Router();

paymentsRouter.post("/create", createPayment);
paymentsRouter.post("/webhook", midtransWebhook);

export default paymentsRouter;