import { prisma } from "../../db/prisma.js";
import { hashPassword, compareHash } from "../../utils/bcryptjs.js";
import { createToken } from "../../utils/jwt.js";
import type { RegisterUserInput, LoginUserInput } from "./auth.types.js";

class AuthService {
  /**
   * Registers a new user.
   */
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

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, username, email, password: hashedPassword },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Logs in a user and returns a JWT.
   */
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
        updatedAt: true
      }, where: { id }
    })

    return userById
  }
}

export default new AuthService();
