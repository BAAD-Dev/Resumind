import type { User } from "@prisma/client";
import prisma from "../../config/prisma.js";

class UserServices {
  createUser = async (userData: Omit<User, "id">): Promise<User> => {
    try {
      const newUser = await prisma.user.create({
        data: {
          email: userData.email,
          username: userData.username,
          password: userData.password,
        },
      });
      return newUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

export default new UserServices();
