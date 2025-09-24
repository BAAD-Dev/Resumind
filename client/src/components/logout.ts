"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const logoutHandler = async () => {
  const cookieStorage = await cookies();
  
  // hapus cookies
  cookieStorage.set("token", "", { maxAge: 0, domain: "resumind.live" });

  return redirect("/");
};
