import { z } from "zod";

// ===== Request (Body) =====
export const CreatePaymentBodySchema = z.object({
    orderId: z.string().min(3),
    amount: z.number().int().positive(),
    customerName: z.string().optional(),
    customerEmail: z.string().email().optional(),
    customerPhone: z.string().optional(),
});
export type CreatePaymentBody = z.infer<typeof CreatePaymentBodySchema>;

// ===== Service Params =====
export type CreateSnapParams = {
    orderId: string;
    amount: number;
    customerName?: string | undefined;
    customerEmail?: string | undefined;
    customerPhone?: string | undefined;
};

// ===== Service Result / Controller Response =====
export type SnapCreateTransactionResult = {
    token: string;
    redirect_url?: string;
};

export type CreatePaymentResponse = {
    token: string;
    redirect_url?: string | undefined;
};
