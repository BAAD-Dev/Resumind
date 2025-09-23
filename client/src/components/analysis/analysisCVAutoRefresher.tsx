"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresher({
  intervalMs = 3000,
}: {
  intervalMs?: number;
}) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => router.refresh(), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, router]);
  return null;
}
