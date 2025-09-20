import midtransClient from "midtrans-client";
import { env } from "../../config/env.js";
import type { CreateSnapParams, SnapCreateTransactionResult } from "./payments.types.js";

const snap = new midtransClient.Snap({
    isProduction: env.midtrans.isProduction,
    serverKey: env.midtrans.serverKey,
    clientKey: env.midtrans.clientKey,
});

// Ambil parameter type dari method instance Snap
type SnapTxParams = Parameters<typeof snap.createTransaction>[0];
type CustomerDetails = { first_name?: string; email?: string; phone?: string };

type SnapTxParamsExtended = SnapTxParams & {
    customer_details?: CustomerDetails;
};

export async function createSnapTransaction(
    p: CreateSnapParams
): Promise<SnapCreateTransactionResult> {
    const parameter: SnapTxParamsExtended = {
        transaction_details: {
            order_id: p.orderId,
            gross_amount: p.amount,
        },
    };

    if (p.customerName || p.customerEmail || p.customerPhone) {
        parameter.customer_details = {};
        if (p.customerName) parameter.customer_details.first_name = p.customerName;
        if (p.customerEmail) parameter.customer_details.email = p.customerEmail;
        if (p.customerPhone) parameter.customer_details.phone = p.customerPhone;
    }

    const tx = await snap.createTransaction(parameter);
    return { token: tx.token, redirect_url: tx.redirect_url };
}
