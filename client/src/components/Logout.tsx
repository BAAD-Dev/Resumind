"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function LogoutHandler() {
  const cookieStorage = await cookies();

  // hapus cookies
  cookieStorage.delete("token");

  redirect("/");
}
