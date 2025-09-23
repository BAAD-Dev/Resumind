export const dynamic = "force-dynamic";

import { formatDate } from "@/lib/format";
import { analyzeJobMatchAction, deleteJobAction } from "./action";
import {
  getCVs,
  getUserJobs,
  getAnalysesForCV,
  pickLatestJobMatch,
} from "./data";
import AutoRefresher from "@/components/analysis/analysisCVAutoRefresher";

export default async function JobMatcherPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const [cvs, jobs] = await Promise.all([getCVs(), getUserJobs()]);

  const selectedCvId = (searchParams?.cv as string) || cvs[0]?.id || "";
  const init = Boolean(searchParams?.init);

  const analyses = selectedCvId ? await getAnalysesForCV(selectedCvId) : [];
  const latestJobMatch = pickLatestJobMatch(analyses);

  const waiting =
    selectedCvId &&
    init &&
    (!latestJobMatch || latestJobMatch.status?.toUpperCase() !== "COMPLETED");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-6 space-y-6">
        {/* Evaluate with Job Posting */}
        <div className="bg-white shadow rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Evaluate with Job Posting
          </h2>

          {waiting ? (
            <WaitingPanel />
          ) : (
            <form action={analyzeJobMatchAction} className="space-y-4">
              {/* Select CV */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select CV
                </label>
                <select
                  name="cvId"
                  defaultValue={selectedCvId}
                  className="w-full border rounded-md p-2"
                  required
                >
                  {!selectedCvId && (
                    <option value="">— Choose your CV —</option>
                  )}
                  {cvs.map((cv) => (
                    <option key={cv.id} value={cv.id}>
                      {cv.originalName} · {formatDate(cv.createdAt)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Choose existing Job OR paste a new one */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Existing Job */}
                <div className="rounded-xl border p-4">
                  <div className="text-sm font-medium mb-2">
                    Use a Saved Job
                  </div>
                  <select name="jobId" className="w-full border rounded-md p-2">
                    <option value="">— Select a saved job —</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.title}
                        {job.company ? ` · ${job.company}` : ""} ·{" "}
                        {formatDate(job.createdAt)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    If you select a saved job, you can leave the “Paste job
                    posting” box empty.
                  </p>
                </div>

                {/* Paste new Job */}
                <div className="rounded-xl border p-4">
                  <div className="text-sm font-medium mb-2">
                    Or paste a new Job Posting
                  </div>
                  <textarea
                    name="jobText"
                    rows={6}
                    placeholder="Paste the job description here…"
                    className="w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      name="jobTitle"
                      placeholder="Job Title (optional)"
                      className="w-full border rounded-md p-2"
                    />
                    <input
                      name="jobCompany"
                      placeholder="Company (optional)"
                      className="w-full border rounded-md p-2"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    We’ll save this as a new Job for future use.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
              >
                Evaluate Job Posting
              </button>
            </form>
          )}
        </div>

        {/* Latest result */}
        {latestJobMatch?.status?.toUpperCase() === "COMPLETED" && (
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Latest Match Result</h2>
            <ResultSummary
              result={latestJobMatch.result}
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
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {job.title}
                      {job.company ? ` · ${job.company}` : ""}
                    </div>
                    <div className="text-xs text-slate-600">
                      Saved {formatDate(job.createdAt)}
                    </div>
                  </div>
                  <form
                    action={async () => {
                      "use server";
                      await deleteJobAction(job.id, selectedCvId);
                    }}
                  >
                    <button className="text-sm rounded-md border px-3 py-1.5 hover:bg-slate-50">
                      Delete
                    </button>
                  </form>
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

function WaitingPanel() {
  return (
    <div className="rounded-xl border bg-white p-6 text-center">
      <div className="relative mx-auto h-20 w-20">
        <div
          className="h-20 w-20 rounded-full"
          style={{ background: `conic-gradient(#2563eb 120deg, #e5e7eb 0deg)` }}
        />
        <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center shadow-sm">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
        </div>
      </div>
      <h3 className="mt-4 text-lg font-semibold">
        Running <span className="text-blue-600">Job Match Analysis</span>
      </h3>
      <p className="text-slate-600 mt-1">
        This may take a short while. The page will refresh automatically.
      </p>
      <div className="mt-4">
        <AutoRefresher intervalMs={3000} />
      </div>
    </div>
  );
}

function ResultSummary({ result, when }: { result: any; when: string }) {
  const score =
    typeof result?.overallScore === "number"
      ? Math.max(0, Math.min(100, result.overallScore))
      : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {score !== null && (
          <div className="relative h-14 w-14">
            <div
              className="h-14 w-14 rounded-full"
              style={{
                background: `conic-gradient(#2563eb ${
                  score * 3.6
                }deg, #e5e7eb 0deg)`,
              }}
            />
            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
              <div className="text-sm font-semibold">{score}</div>
            </div>
          </div>
        )}
        <div className="text-sm text-slate-600">
          Generated at {formatDate(when)}
        </div>
      </div>

      {result?.summary && (
        <div className="rounded-lg border bg-slate-50/60 p-4">
          <div className="text-sm font-semibold mb-1">Summary</div>
          <p className="text-slate-700">{result.summary}</p>
        </div>
      )}

      {(result?.actionableNextSteps?.length ?? 0) > 0 && (
        <div className="rounded-lg border bg-slate-50/60 p-4">
          <div className="text-sm font-semibold mb-1">
            Actionable Next Steps
          </div>
          <ul className="list-disc pl-5 text-slate-700">
            {result.actionableNextSteps.map((s: string, i: number) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function JobMatchHistory({ analyses }: { analyses: any[] }) {
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
              className="flex items-center justify-between rounded-lg border p-4 bg-white"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium">
                  {a.status === "COMPLETED" ? "Completed" : a.status}
                </div>
                <div className="text-xs text-slate-600">
                  {formatDate(a.createdAt)} · Analysis ID: {a.id.slice(0, 6)}…
                </div>
              </div>
              {typeof a.result?.overallScore === "number" && (
                <div className="text-sm font-semibold">
                  Score: {Math.round(a.result.overallScore)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
