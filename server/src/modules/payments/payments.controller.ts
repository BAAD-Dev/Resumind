import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
import {
  createPaymentFlow,
  handleMidtransWebhook,
  verifyMidtransSignature,
} from "./payments.service.js";
import type { MidtransWebhookBody } from "./payments.types.js";

// We define the price for the premium plan here on the backend for security.
const PREMIUM_PLAN_PRICE = 29999; // e.g., Rp 29,999

/** POST /payments/create */
export async function createPayment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user!; // We get the real, logged-in user from the 'protect' middleware
    console.log(">>>>>>>>>>.", req.user);

    // The server generates the unique orderId for security
    const orderId = `RESUMIND-UPGRADE-${user.id.slice(-4)}-${randomUUID().slice(
      0,
      8
    )}`;

    const result = await createPaymentFlow({
      userId: user.id,
      orderId: orderId,
      amount: PREMIUM_PLAN_PRICE,
      customerName: user.username,
      customerEmail: user.email,
    });

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/** POST /payments/webhook */
export async function midtransWebhook(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const body = req.body as MidtransWebhookBody;

    if (!verifyMidtransSignature(body)) {
      // Use next(err) for consistent error handling
      throw new Error("Invalid Midtrans signature.", {
        cause: { status: 403 },
      });
    }

    const result = await handleMidtransWebhook(body);
    if (!result.ok) {
      // Let the central error handler manage this
      throw new Error(`Webhook processing failed: ${result.reason}`);
    }

    return res.json({ received: true, idempotent: result.idempotent ?? false });
  } catch (err) {
    next(err);
  }
}
