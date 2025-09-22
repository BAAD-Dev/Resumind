import type { Request, Response, NextFunction } from "express";
import { CreatePaymentBodySchema, type MidtransWebhookBody } from "./payments.types.js";
import { createPaymentFlow, handleMidtransWebhook, verifyMidtransSignature } from "./payments.service.js";

/** POST /payments/create */
export async function createPayment(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = CreatePaymentBodySchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid body", errors: parsed.error.flatten() });
        }
        // const user = req.user
        // const userID = user?.id
        const TEST_USER_ID = "68d0012355f72ae0b7074afa";
        const { orderId, amount, customerName, customerEmail, customerPhone } = parsed.data;

        const result = await createPaymentFlow({
            userId: TEST_USER_ID,
            orderId,
            amount,
            ...(customerName !== undefined && { customerName }),
            ...(customerEmail !== undefined && { customerEmail }),
            ...(customerPhone !== undefined && { customerPhone }),
        });

        return res.status(201).json(result);
    } catch (err: any) {
        if (err?.message === "MIDTRANS_CREATE_FAILED") {
            return res.status(400).json({ message: "Failed to create Midtrans transaction" });
        }
        next(err);
    }
}

/** POST /payments/webhook */
export async function midtransWebhook(req: Request, res: Response) {
    const body = req.body as MidtransWebhookBody;

    if (!verifyMidtransSignature(body)) {
        return res.status(403).json({ message: "Invalid signature" });
    }

    const result = await handleMidtransWebhook(body);
    if (!result.ok) {
        return res.status(400).json({ message: "Webhook error", reason: result.reason });
    }

    return res.json({ received: true, idempotent: result.idempotent ?? false });
}
