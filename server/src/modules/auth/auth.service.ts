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
}

export default new AuthService();
