import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logoutHandler = async (formData: FormData) => {
  "use server";
  const cookieStorage = await cookies();
};
