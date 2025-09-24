"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logoutHandler = async () => {
  // const cookieStorage = await cookies();
  // cookieStorage.set("token", "")
  // hapus cookies
  // cookieStorage.clear();

  (await cookies()).delete("token");

  return redirect("/");
};
