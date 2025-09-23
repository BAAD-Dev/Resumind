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
    result?: any;
    cvId: string;
    jobDescriptionId?: string | null; // or jobId, depending on your model naming
    createdAt: string;
    updatedAt: string;
};

const BASE = process.env.NEXT_PUBLIC_BASE_URL!;

export async function getCVs(): Promise<CVItem[]> {
    const token = (await cookies()).get("token")?.value;

    const res = await fetch(`${BASE}/api/cv`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to load CVs: ${res.status} ${text}`);
    }
    const json = await res.json();
    return (Array.isArray(json) ? json : json?.data) as CVItem[];
}

export async function getUserJobs(): Promise<JobItem[]> {
    const token = (await cookies()).get("token")?.value;
    const res = await fetch(`${BASE}/api/jobs`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to load jobs: ${res.status} ${text}`);
    }
    const json = await res.json();
    return (Array.isArray(json) ? json : json?.data) as JobItem[];
}

export async function getAnalysesForCV(cvId: string): Promise<Analysis[]> {
    const token = (await cookies()).get("token")?.value;

    const res = await fetch(`${BASE}/api/analysis/cv/${cvId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to load analyses: ${res.status} ${text}`);
    }
    const json = await res.json();
    return (Array.isArray(json) ? json : json?.data) as Analysis[];
}

export function pickLatestJobMatch(list: Analysis[]): Analysis | null {
    const items = (list ?? []).filter(a => a.type?.toUpperCase() === "JOB_MATCH_ANALYSIS");
    if (!items.length) return null;
    items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return items[0];
}
