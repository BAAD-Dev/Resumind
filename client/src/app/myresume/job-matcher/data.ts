import "server-only";
import { cookies } from "next/headers";

/* =========================
 * Types
 * ========================= */
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

export type JobItem = {
    id: string;
    title: string;
    company?: string | null;
    originalText: string;
    createdAt: string;
    updatedAt: string;
};

export type Analysis = {
    id: string;
    type: "CV_ANALYSIS" | "JOB_MATCH_ANALYSIS" | string;
    status: "PENDING" | "COMPLETED" | string;
    result?: unknown; // <-- hasil dari backend object/JSON, bukan string
    cvId: string;
    jobDescriptionId?: string | null; // or jobId, depending on your model naming
    createdAt: string;
    updatedAt: string;
};

export type userLogin = {
    id: string;
    name: string;
    username: string;
    email: string;
    role: "FREE" | "PAID";
    createdAt: string;
};

/* =========================
 * Config & Helpers
 * ========================= */
const BASE = process.env.NEXT_PUBLIC_BASE_URL!;


/* =========================
 * Data Fetchers
 * ========================= */
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

export async function getUserJobs(): Promise<JobItem[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;


    const res = await fetch(`${BASE}/api/jobs`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${text}`);
    }

    const json = await res.json()

    return json;
}

export async function getAnalysesForCV(cvId: string): Promise<Analysis[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${BASE}/api/analysis/cv/${cvId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${text}`);
    }

    const json = await res.json()

    return json;
}

export async function getUserLogin(): Promise<userLogin | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    const res = await fetch(`${BASE}/api/auth/userLogin`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) {
        return null;
    }
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to load userLogin: ${res.status} ${text}`);
    }

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${text}`);
    }

    const json = await res.json()

    return json;
}

/* =========================
 * Utilities
 * ========================= */
export function pickLatestJobMatch(list: Analysis[]): Analysis | null {
    const items = (list ?? []).filter(
        (a) => a.type?.toUpperCase() === "JOB_MATCH_ANALYSIS"
    );
    if (!items.length) return null;
    items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return items[0];
}

export async function assertPaidUser() {
    const user = await getUserLogin();
    if (!user) throw new Error("Not logged in");
    if (user.role !== "PAID") throw new Error("Upgrade required");
    return user;
}