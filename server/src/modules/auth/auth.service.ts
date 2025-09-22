import { prisma } from "../../db/prisma.js";
import { hashPassword, compareHash } from "../../utils/bcryptjs.js";
import { createToken } from "../../utils/jwt.js";
import type { RegisterUserInput, LoginUserInput } from "./auth.types.js";
import { randomUUID } from "crypto";
import EmailService from "../../services/email.js";

class AuthService {
  async registerUser(userData: RegisterUserInput) {
    const { name, username, email, password } = userData;

    const existsUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existsUsername) {
      throw new Error("Username already in use", { cause: { status: 409 } });
    }
    const existsEmail = await prisma.user.findUnique({ where: { email } });
    if (existsEmail) {
      throw new Error("Email already in use", { cause: { status: 409 } });
    }

    const hashed = await hashPassword(password);

    // 3. Generate a unique, random token for email verification
    const verificationToken = randomUUID();

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashed,
        emailVerificationToken: verificationToken, // 👈 4. Save the token
      },
    });

    // 5. Send the verification email!
    await EmailService.sendVerification(
      user.email,
      user.name,
      verificationToken
    );

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async loginUser(credentials: LoginUserInput) {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Invalid Email or Password", { cause: { status: 401 } });
    }

    const isPasswordValid = await compareHash(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid Email or Password", { cause: { status: 401 } });
    }

    if (!user.isVerified) {
      throw new Error("Please verify your email before logging in.", {
        cause: { status: 403 },
      }); // 403 Forbidden
    }

    const token = createToken({
      id: user.id,
      username: user.username,
      email: user.email,
    });
    return token;
  }

  async userById(id: string) {
    const userById = await prisma.user.findUnique({
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
      },
      where: { id },
    });

    return userById;
  }

  async verifyUserEmail(token: string) {
    // 1. Find the user with this specific, un-used verification token
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new Error("Invalid or expired verification token.", {
        cause: { status: 404 },
      });
    }

    // 2. Update the user to mark them as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: null, // CRITICAL: Invalidate the token after use
      },
    });

    return { message: "Email verified successfully. You can now log in." };
  }
}

export default new AuthService();
