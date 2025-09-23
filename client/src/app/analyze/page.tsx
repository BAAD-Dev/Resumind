"use server";

import { cookies } from "next/headers";
import AnalyzeClient from "@/components/AnalyzeClient";

export default async function AnalyzePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let user: { role: string } | null = null;

  if (token) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/userLogin`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );
      if (res.ok) {
        const data = await res.json();
        user = data.dataUser;
      }
    } catch (err) {
      console.error("Failed fetch user:", err);
    }
  }

  // lempar user ke client
  return <AnalyzeClient user={user} />;
}
