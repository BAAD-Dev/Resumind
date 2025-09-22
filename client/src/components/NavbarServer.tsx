"use server";

import { cookies } from "next/headers";
import Navbar from "./Navbar";



export default async function NavbarServer() {
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");

  // true kalau ada token
  let isLoggedIn;
  if (token) {
    isLoggedIn = true;
  } else {
    isLoggedIn = false;
  }

  return <Navbar isLoggedIn={isLoggedIn} />;
}
