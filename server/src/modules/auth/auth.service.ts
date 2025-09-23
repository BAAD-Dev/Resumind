import { prisma } from "../../db/prisma.js";
import { hashPassword, compareHash } from "../../utils/bcryptjs.js";
import { createToken } from "../../utils/jwt.js";
import type { RegisterUserInput, LoginUserInput } from "./auth.types.js";
import { randomUUID } from "crypto";
import EmailService from "../../services/email.js";

class AuthService {
  userById(id: string) {
    throw new Error("Method not implemented.");
  }
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
    const verificationToken = randomUUID();

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashed,
        emailVerificationToken: verificationToken,
      },
    });

    // Corrected function call to match our email service
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

    // 👇 The order of these checks is now more secure and user-friendly
    if (!user.isVerified) {
      throw new Error("Please verify your email before logging in.", {
        cause: { status: 403 },
      });
    }

    const isPasswordValid = await compareHash(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Email or Password", { cause: { status: 401 } });
    }

    const token = createToken({
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    });
    return token;
  }

  // Renamed for consistency and fixed the duplicate 'where' clause
  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      // Select is great for security - it ensures we never accidentally send the password
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async verifyUserEmail(token: string) {
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new Error("Invalid or expired verification token.", {
        cause: { status: 404 },
      });
    }

    // Added a check for users who are already verified
    if (user.isVerified) {
      return { message: "This email has already been verified." };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerifiedAt: new Date(),
        emailVerificationToken: `${user.id}-verified-${Date.now()}`,
      },
    });

    return { message: "Email verified successfully. You can now log in." };
  }
}

export default new AuthService();
