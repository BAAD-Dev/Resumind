import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465, // true for 465, false for other ports
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass,
  },
});

class EmailService {
  async sendVerification(to: string, name: string, token: string) {
    const verificationUrl = `http://localhost:3000/api/auth/verify/${token}`; //Change this later in production, frontend URL later on

    const mailOptions = {
      from: '"Resumind Team" <noreply.resumind@gmail.com>',
      to: to,
      subject: "Welcome to Resumind! Please Verify Your Email",
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for registering with Resumind. Please click the link below to verify your email address and activate your account:</p>
        <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>If you did not create an account, please ignore this email.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("[EMAIL] Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  async sendPaymentReceiptEmail(
    to: string,
    name: string,
    order: { orderId: string; amount: number; paidAt: Date }
  ) {
    // Format the amount into a user-friendly currency format (Indonesian Rupiah)
    const formattedAmount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(order.amount);

    const mailOptions = {
      from: '"Resumind Team" <noreply.resumind@gmail.com>',
      to: to,
      subject: `Your Receipt for Resumind Premium - Order #${order.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Thank You for Your Purchase, ${name}!</h2>
          <p>Your upgrade to Resumind Premium has been successfully processed. You now have full access to all our premium features, including the Job Matcher.</p>
          
          <h3>Receipt Details:</h3>
          <ul>
            <li><strong>Order ID:</strong> ${order.orderId}</li>
            <li><strong>Date of Payment:</strong> ${order.paidAt.toLocaleDateString(
              "en-GB"
            )}</li>
            <li><strong>Total Amount:</strong> ${formattedAmount}</li>
            <li><strong>Plan:</strong> Resumind Premium (Lifetime Access)</li>
          </ul>

          <p>You can start using your premium features by logging into your account now.</p>
          <p>Thank you for supporting Resumind!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}

export default new EmailService();
