import { snap } from "@/lib/midtrans";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, customerName, customerEmail, customerPhone } =
      body;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
    };

    const transaction = await snap.createTransaction(parameter);
    console.log(transaction);

    return NextResponse.json({ token: transaction.token });
  } catch (error) {
    console.error("Midtrans error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
