import "server-only";
import { cookies } from "next/headers";

export type CVItem = {
    id: string;
    originalName: string;
    fileUrl: string;
    isGuest: boolean;
    expiresAt: string | null;
    userId?: string | null;
    createdAt: string;
    updatedAt: string;
};

export async function getCVs(): Promise<CVItem[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/cv`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to load CV list: ${res.status} ${text}`);
    }

    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) {
        throw new Error("Invalid CV list payload (expected array)");
    }
    return data as CVItem[];
}
