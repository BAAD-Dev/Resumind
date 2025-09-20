import type { Request, Response, NextFunction } from "express";
import { createSnapTransaction } from "./payments.service.js";
import {
    CreatePaymentBodySchema,
    type CreateSnapParams,
    type SnapCreateTransactionResult,
    type CreatePaymentResponse,
} from "./payments.types.js";

export async function createPayment(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = CreatePaymentBodySchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid body",
                errors: parsed.error.flatten(),
            });
        }

        const input: CreateSnapParams = parsed.data;

        const tx: SnapCreateTransactionResult = await createSnapTransaction(input);

        if (!tx?.token) {
            return res.status(400).json({ message: "Failed to create Midtrans transaction" });
        }

        const response: CreatePaymentResponse = {
            token: tx.token,
            redirect_url: tx.redirect_url,
        };

        return res.status(201).json(response);
    } catch (err) {
        next(err);
    }
}
