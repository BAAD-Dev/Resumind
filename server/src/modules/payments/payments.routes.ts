import { Router } from "express";
import { createPayment } from "./payments.controller.js";

const paymentsRouter = Router();

paymentsRouter.post("/create", createPayment);

export default paymentsRouter;