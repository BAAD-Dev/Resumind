import midtransClient from "midtrans-client";
import crypto from "crypto";
import { env } from "../../config/env.js";
import { prisma } from "../../db/prisma.js";
import { OrderStatus, UserRole } from "@prisma/client";
import type {
    CreateSnapParams,
    MidtransWebhookBody,
    SnapCreateTransactionResult,
} from "./payments.types.js";

const snap = new midtransClient.Snap({
    isProduction: env.midtrans.isProduction,
    serverKey: env.midtrans.serverKey,
    clientKey: env.midtrans.clientKey,
});

// ===== Midtrans helper =====
type SnapTxParams = Parameters<typeof snap.createTransaction>[0];
type CustomerDetails = { first_name?: string; email?: string; phone?: string };
type SnapTxParamsExtended = SnapTxParams & { customer_details?: CustomerDetails };

export async function createSnapTransaction(
    p: CreateSnapParams
): Promise<SnapCreateTransactionResult> {
    const parameter: SnapTxParamsExtended = {
        transaction_details: { order_id: p.orderId, gross_amount: p.amount },
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

export function verifyMidtransSignature(body: MidtransWebhookBody): boolean {
    const raw = body.order_id + body.status_code + body.gross_amount + env.midtrans.serverKey;
    const expected = crypto.createHash("sha512").update(raw).digest("hex");
    return expected === body.signature_key;
}

function mapMidtransStatus(body: MidtransWebhookBody): OrderStatus {
    const s = body.transaction_status;
    if (s === "settlement") return OrderStatus.PAID;
    if (s === "capture") return body.fraud_status === "accept" ? OrderStatus.PAID : OrderStatus.PENDING;
    if (s === "pending") return OrderStatus.PENDING;
    if (s === "expire") return OrderStatus.EXPIRED;
    if (s === "cancel") return OrderStatus.CANCELLED;
    if (s === "refund" || s === "partial_refund") return OrderStatus.REFUNDED;
    return OrderStatus.FAILED;
}

// ====== Service utama (termasuk akses Prisma langsung) ======
export async function createPaymentFlow(args: {
    userId: string;
    orderId: string;
    amount: number;
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
}): Promise<{ token: string; redirect_url?: string; orderId: string }> {
    // 1) Buat order pending (omit-if-undefined untuk field opsional)
    await prisma.order.create({
        data: {
            orderId: args.orderId,
            userId: args.userId,
            amount: args.amount,
            status: OrderStatus.PENDING,
            ...(args.customerName !== undefined && { customerName: args.customerName }),
            ...(args.customerEmail !== undefined && { customerEmail: args.customerEmail }),
            ...(args.customerPhone !== undefined && { customerPhone: args.customerPhone }),
        },
    });

    // 2) Transaksi Snap
    const tx = await createSnapTransaction({
        orderId: args.orderId,
        amount: args.amount,
        customerName: args.customerName,
        customerEmail: args.customerEmail,
        customerPhone: args.customerPhone,
    });

    if (!tx?.token) {
        await prisma.order.update({ where: { orderId: args.orderId }, data: { status: OrderStatus.FAILED } });
        throw new Error("MIDTRANS_CREATE_FAILED");
    }

    // 3) Simpan token
    await prisma.order.update({
        where: { orderId: args.orderId },
        data: { snapToken: tx.token },
    });

    return {
        token: tx.token,
        orderId: args.orderId,
        ...(tx.redirect_url !== undefined && { redirect_url: tx.redirect_url }),
    };
}

type HandleWebhookResult =
    | { ok: true; idempotent?: boolean }
    | { ok: false; reason: "ORDER_NOT_FOUND" | "AMOUNT_MISMATCH" };

export async function handleMidtransWebhook(body: MidtransWebhookBody): Promise<HandleWebhookResult> {
    const incomingStatus = mapMidtransStatus(body);

    const existing = await prisma.order.findUnique({ where: { orderId: body.order_id } });
    if (!existing) {
        await prisma.paymentEvent.create({
            data: { orderId: body.order_id, type: "ORPHAN_EVENT", payload: body as any },
        });
        return { ok: false, reason: "ORDER_NOT_FOUND" };
    }

    // Idempotent PAID→PAID
    if (existing.status === OrderStatus.PAID && incomingStatus === OrderStatus.PAID) {
        await prisma.paymentEvent.create({
            data: { orderId: existing.orderId, type: body.transaction_status, payload: body as any },
        });
        return { ok: true, idempotent: true };
    }

    // Validasi nominal (opsional tapi bagus)
    if (Number(existing.amount) !== Number(body.gross_amount)) {
        await prisma.paymentEvent.create({
            data: { orderId: existing.orderId, type: "AMOUNT_MISMATCH", payload: body as any },
        });
        return { ok: false, reason: "AMOUNT_MISMATCH" };
    }

    await prisma.$transaction(async (tx) => {
        // Audit event
        await tx.paymentEvent.create({
            data: { orderId: existing.orderId, type: body.transaction_status, payload: body as any },
        });

        const paidAt =
            incomingStatus === OrderStatus.PAID
                ? body.settlement_time
                    ? new Date(body.settlement_time)
                    : new Date()
                : null;

        const updated = await tx.order.update({
            where: { orderId: existing.orderId },
            data: {
                status: incomingStatus,
                transactionId: body.transaction_id ?? null,
                paymentMethod: body.payment_type ?? null,
                paidAt,
            },
        });

        // Role management
        if (incomingStatus === OrderStatus.PAID && updated.userId) {
            await tx.user.update({ where: { id: updated.userId }, data: { role: UserRole.PAID } });
        }

        if (
            (incomingStatus === OrderStatus.REFUNDED ||
                incomingStatus === OrderStatus.CANCELLED ||
                incomingStatus === OrderStatus.EXPIRED) &&
            updated.userId
        ) {
            const stillPaid = await tx.order.findFirst({
                where: { userId: updated.userId, status: OrderStatus.PAID, orderId: { not: updated.orderId } },
                select: { id: true },
            });
            if (!stillPaid) {
                await tx.user.update({ where: { id: updated.userId }, data: { role: UserRole.FREE } });
            }
        }
    });

    return { ok: true };
}
