// app/myresume/resume/[id]/data.ts
import "server-only";
import { cookies } from "next/headers";

export type SectionItem = {
    sectionName: string;
    score: number;
    positiveFeedback: string;
    improvementSuggestions: string;
};

export type AnalysisResult = {
    overallScore: number;
    summary: string;
    extractedKeywords?: {
        technicalSkills?: string[];
        softSkills?: string[];
    };
    sectionBreakdown?: SectionItem[];
    rewrittenContent?: {
        improvedSummary?: string;
        improvedExperienceBullets?: string[];
    };
    actionableNextSteps?: string[];
};

export type CvAnalysis = {
    id: string;
    type: "CV_ANALYSIS" | string;
    status: "COMPLETED" | "PENDING" | string;
    result?: AnalysisResult | null;
    isGuest: boolean;
    expiresAt: string | null;
    userId?: string | null;
    cvId: string;
    jobDescriptionId?: string | null;
    createdAt: string;
    updatedAt: string;
};

export async function getAnalysesByCvId(cvId: string): Promise<CvAnalysis[]> {
    const token = (await cookies()).get("token")?.value;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/analysis/cv/${cvId}`,
        {
            method: "GET",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            cache: "no-store",
        }
    );

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to load analysis list: ${res.status} ${text}`);
    }

    const json = await res.json();
    const arr: unknown = (json?.data ?? json);

    return Array.isArray(arr) ? (arr as CvAnalysis[]) : [];
}

/** Pilih 1 analisis terbaik untuk ditampilkan */
export function pickBestAnalysis(list: CvAnalysis[]): CvAnalysis | null {
    if (!list?.length) return null;

    // urutkan terbaru
    const sorted = [...list].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    // prioritas COMPLETED terbaru
    const done = sorted.find(a => a.type?.toUpperCase() === "CV_ANALYSIS");
    return done ?? sorted[0];
}
