"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/* =========================
 * Helpers (Auth)
 * ========================= */
type UserRole = "FREE" | "PAID";
type AuthUser = {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
};


async function fetchCurrentUser(token?: string): Promise<AuthUser | null> {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("token")?.value;
    if (!authToken) return null;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/userLogin`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (res.status === 401 || res.status === 403) return null;
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to load user: ${res.status} ${text}`);
    }

    const json = await res.json().catch(() => ({}));
    const user = (json?.dataUser ?? json) as Partial<AuthUser>;
    if (!user || !user.id || !user.role) return null;
    return user as AuthUser;
}

async function assertPaidUser() {
    const user = await fetchCurrentUser();
    if (!user) {
        // Belum login -> arahkan ke login
        redirect(`/login?next=${encodeURIComponent("/job-matcher")}`);
    }

    if (user.role !== "PAID") {
        // Sudah login tapi FREE -> arahkan ke halaman upgrade
        redirect(`/payment?reason=upgrade_required`);
    }
    return user;
}

/* =========================
 * Actions
 * ========================= */

/** Create a Job from pasted text (returns jobId) */
export async function createJobFromText(input: {
    title?: string;
    company?: string;
    originalText: string;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
            // kirim meta bila backend mendukung; aman diabaikan kalau tidak dipakai
            title: input.title,
            company: input.company,
            jobText: input.originalText,
        }),
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to create job: ${res.status} ${text}`);
    }

    const json = await res.json();
    const job = json?.data ?? json;
    const jobId = job?.id;
    if (!jobId) throw new Error("No jobId returned from /api/jobs");
    return String(jobId);
}

/** Start Job Match, then redirect back with ?cv=...&init=1 to begin polling */
export async function analyzeJobMatchAction(formData: FormData) {
    // ✅ pastikan user PAID
    await assertPaidUser();

    const cvId = String(formData.get("cvId") || "");
    const existingJobId = String(formData.get("jobId") || "");
    const jobText = String(formData.get("jobText") || "");
    const jobTitle = String(formData.get("jobTitle") || "");
    const jobCompany = String(formData.get("jobCompany") || "");

    if (!cvId) throw new Error("Please select a CV.");

    // If no existing job selected, create one from pasted text
    let jobId = existingJobId.trim();
    if (!jobId) {
        if (!jobText.trim()) throw new Error("Provide a Job ID or paste a job posting.");
        jobId = await createJobFromText({ title: jobTitle, company: jobCompany, originalText: jobText });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/analysis/match`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ cvId, jobId }),
        cache: "no-store",
    });

    // Accept typical idempotent/success codes
    if (![200, 201, 202, 409].includes(res.status)) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to enqueue job match: ${res.status} ${text}`);
    }

    redirect(`/myresume/job-matcher/${cvId}?init=1`);
}

/** Delete a saved job, keep current selection in URL if present */
export async function deleteJobAction(jobId: string, currentCvId?: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/jobs/${encodeURIComponent(jobId)}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to delete job: ${res.status} ${text}`);
    }

    redirect(currentCvId ? `/job-matcher?cv=${encodeURIComponent(currentCvId)}` : "/job-matcher");
}
