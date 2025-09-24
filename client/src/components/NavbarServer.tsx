import { cookies } from "next/headers";
import Navbar from "./Navbar";

export default async function NavbarServer() {
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token")?.value;

  let isLoggedIn = false;
  let userName = "";
  let role = "";

  if (token) {
    isLoggedIn = true;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/userLogin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        }
      );

      if (response.ok) {
        const data = await response.json();
        userName = data?.dataUser.name;
        role = data?.dataUser.role;
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  }
  // console.log(userName);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userName={userName} role={role} />
    </>
  );
}
