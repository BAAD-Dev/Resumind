import { z } from "zod";

export const CreatePaymentBodySchema = z.object({
    orderId: z.string().min(3),
    amount: z.number().int().positive(),
    customerName: z.string().optional(),
    customerEmail: z.string().email().optional(),
    customerPhone: z.string().optional(),
});
export type CreatePaymentBody = z.infer<typeof CreatePaymentBodySchema>;

export type CreateSnapParams = {
    orderId: string;
    amount: number;
    customerName?: string | undefined;
    customerEmail?: string | undefined;
    customerPhone?: string | undefined;
};

export type SnapCreateTransactionResult = {
    token: string;
    redirect_url?: string;
};

export type CreatePaymentResponse = {
    token: string;
    redirect_url?: string;
    orderId: string;
};

export type MidtransWebhookBody = {
    order_id: string;
    transaction_id?: string;
    transaction_status:
    | "capture"
    | "settlement"
    | "pending"
    | "deny"
    | "cancel"
    | "expire"
    | "refund"
    | "partial_refund"
    | string;
    fraud_status?: "accept" | "challenge" | "deny" | string;
    payment_type?: string;
    status_code: string;
    gross_amount: string;
    signature_key: string;
    settlement_time?: string;
};
