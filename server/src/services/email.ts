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
}

export default new EmailService();
