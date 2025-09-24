import "server-only";
import { cookies } from "next/headers";

export async function requestAnalysis(cvId: string) {
  const token = (await cookies()).get("token")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/analysis/cv/${cvId}`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      cache: "no-store",
    }
  );

  if (![200, 201, 202, 409].includes(res.status)) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to enqueue analysis: ${res.status} ${text}`);
  }
}
