export const dynamic = "force-dynamic";

import { formatDate } from "@/lib/format";
import {
  getCVs,
  getUserJobs,
  getAnalysesForCV,
  pickLatestJobMatch,
} from "../data";
// import AutoRefresher from "@/components/analysis/analysisCVAutoRefresher";

type SuggestedEdit = {
  originalCVBullet: string;
  suggestedRewrite: string;
};

type KeywordAnalysis = {
  jobKeywords?: string[];
  matchedKeywords?: string[];
  missingKeywords?: string[];
};

export type JobMatchResult = {
  matchScore?: number;
  matchSummary?: string;
  keywordAnalysis?: KeywordAnalysis;
  strengths?: string[];
  improvementAreas?: string[];
  suggestedEdits?: SuggestedEdit[];
};

export type JobMatchAnalysis = {
  id: string;
  createdAt: string;
  status: string;
  type: string;
  result?: JobMatchResult;
};

export default async function JobMatcherPage({
  params,
}: // searchParams,
{
  params: { cvId: string };
  // searchParams?: Record<string, string | string[] | undefined>;
}) {
  const [cvs, jobs] = await Promise.all([getCVs(), getUserJobs()]);

  const selectedCvId = params.cvId || cvs[0]?.id || "";
  // const init = Boolean(searchParams?.init);

  const analyses = selectedCvId
    ? (await getAnalysesForCV(selectedCvId)).map((a) => ({
        ...a,
        result: a.result as JobMatchResult, // 🔑 casting di sini
      }))
    : [];

  const latestJobMatch = pickLatestJobMatch(analyses);

  // const waiting =
  //   selectedCvId &&
  //   init &&
  //   (!latestJobMatch || latestJobMatch.status?.toUpperCase() !== "COMPLETED");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-6 space-y-6">
        {/* Latest result (JOB_MATCH_ANALYSIS) */}
        {latestJobMatch?.status?.toUpperCase() === "COMPLETED" && (
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Latest Match Result</h2>
            <JobMatchResult
              result={latestJobMatch.result as JobMatchResult} // ✅ cast di sini
              when={latestJobMatch.createdAt}
            />
          </div>
        )}

        {/* Saved Jobs + delete */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Saved Jobs</h2>
          {jobs.length ? (
            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between rounded-lg border p-4">
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {job.title}
                      {job.company ? ` · ${job.company}` : ""}
                    </div>
                    <div className="text-xs text-slate-600">
                      Saved {formatDate(job.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No saved jobs yet.</p>
          )}
        </div>

        {/* History */}
        <JobMatchHistory analyses={analyses} />
      </main>
    </div>
  );
}

/* ===== Small UI helpers ===== */

// function WaitingPanel() {
//   return (
//     <div className="rounded-xl border bg-white p-6 text-center">
//       <div className="relative mx-auto h-20 w-20">
//         <div
//           className="h-20 w-20 rounded-full"
//           style={{ background: `conic-gradient(#2563eb 120deg, #e5e7eb 0deg)` }}
//         />
//         <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center shadow-sm">
//           <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
//         </div>
//       </div>
//       <h3 className="mt-4 text-lg font-semibold">
//         Running <span className="text-blue-600">Job Match Analysis</span>
//       </h3>
//       <p className="text-slate-600 mt-1">
//         This may take a short while. The page will refresh automatically.
//       </p>
//       <div className="mt-4">
//         <AutoRefresher intervalMs={3000} />
//       </div>
//     </div>
//   );
// }

/** ===========================
 * COMPONENT: JobMatchResult
 * =========================== */
function JobMatchResult({
  result,
  when,
}: {
  result: JobMatchResult;
  when: string;
}) {
  const score =
    typeof result?.matchScore === "number"
      ? Math.max(0, Math.min(100, result.matchScore))
      : null;

  const summary = result?.matchSummary ?? null;
  const kw = result?.keywordAnalysis ?? {};
  const strengths = Array.isArray(result?.strengths) ? result.strengths : [];
  const improvements = Array.isArray(result?.improvementAreas)
    ? result.improvementAreas
    : [];
  const edits: SuggestedEdit[] = Array.isArray(result?.suggestedEdits)
    ? result.suggestedEdits
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {score !== null && <ScoreDonut score={score} />}
          <div className="text-sm text-slate-600">
            Generated at {formatDate(when)}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section className="rounded-lg border bg-slate-50 p-4">
          <h3 className="font-semibold mb-2">Match Summary</h3>
          <p className="text-slate-700">{summary}</p>
        </section>
      )}

      {/* Keywords */}
      {(kw?.jobKeywords || kw?.matchedKeywords || kw?.missingKeywords) && (
        <section className="grid md:grid-cols-3 gap-4">
          <KeywordCard
            title="Job Keywords"
            items={kw.jobKeywords}
            badgeClass="bg-gray-200"
          />
          <KeywordCard
            title="Matched Keywords"
            items={kw.matchedKeywords}
            badgeClass="bg-green-200"
          />
          <KeywordCard
            title="Missing Keywords"
            items={kw.missingKeywords}
            badgeClass="bg-red-200"
          />
        </section>
      )}

      {/* Strengths & Improvements */}
      <section className="grid md:grid-cols-2 gap-4">
        {strengths.length > 0 && (
          <BulletCard
            title="Strengths"
            bullets={strengths}
            containerClass="bg-green-50 border-green-200"
          />
        )}
        {improvements.length > 0 && (
          <BulletCard
            title="Improvement Areas"
            bullets={improvements}
            containerClass="bg-yellow-50 border-yellow-200"
          />
        )}
      </section>

      {/* Suggested Edits */}
      {edits.length > 0 && (
        <section className="rounded-lg border bg-blue-50 p-4">
          <h3 className="font-semibold mb-3">Suggested Edits</h3>
          <div className="space-y-3">
            {edits.map((e, i) => (
              <div key={i} className="rounded-md bg-white border p-3">
                <p className="text-xs font-semibold text-slate-500 mb-1">
                  Original
                </p>
                <p className="text-sm text-slate-700">{e.originalCVBullet}</p>
                <div className="h-px my-2 bg-slate-200" />
                <p className="text-xs font-semibold text-slate-500 mb-1">
                  Rewrite
                </p>
                <p className="text-sm text-slate-800">{e.suggestedRewrite}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ===== Small subcomponents ===== */

function ScoreDonut({ score }: { score: number }) {
  return (
    <div className="relative h-20 w-20">
      <div
        className="h-20 w-20 rounded-full"
        style={{
          background: `conic-gradient(#2563eb ${score * 3.6}deg, #e5e7eb 0deg)`,
        }}
      />
      <div className="absolute inset-3 rounded-full bg-white flex items-center justify-center">
        <div className="text-lg font-bold">{score}</div>
      </div>
    </div>
  );
}

function KeywordCard({
  title,
  items,
  badgeClass,
}: {
  title: string;
  items?: string[];
  badgeClass?: string;
}) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className="rounded-lg border bg-slate-50 p-4">
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {items.map((k) => (
          <span
            key={k}
            className={`px-2 py-1 text-xs rounded ${
              badgeClass ?? "bg-gray-200"
            }`}>
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

function BulletCard({
  title,
  bullets,
  containerClass,
}: {
  title: string;
  bullets: string[];
  containerClass?: string;
}) {
  if (!Array.isArray(bullets) || bullets.length === 0) return null;
  return (
    <div className={`rounded-lg border p-4 ${containerClass ?? "bg-slate-50"}`}>
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="list-disc pl-5 text-slate-700">
        {bullets.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}

function JobMatchHistory({ analyses }: { analyses: JobMatchAnalysis[] }) {
  const items = (analyses ?? [])
    .filter((a) => a.type?.toUpperCase() === "JOB_MATCH_ANALYSIS")
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">History Matching</h2>
      {!items.length ? (
        <p className="text-gray-500 text-sm">
          No history yet. Once you run a job match, it’ll appear here.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-lg border p-4 bg-white">
              <div className="min-w-0">
                <div className="text-sm font-medium">
                  {a.status === "COMPLETED" ? "Completed" : a.status}
                </div>
                <div className="text-xs text-slate-600">
                  {formatDate(a.createdAt)} · Analysis ID: {a.id.slice(0, 6)}…
                </div>
              </div>
              {typeof a.result?.matchScore === "number" && (
                <div className="text-sm font-semibold">
                  Score: {Math.round(a.result.matchScore)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
