import { formatDate } from "@/lib/format";
import { analyzeJobMatchAction, deleteJobAction } from "./action";
import {
  getCVs,
  getUserJobs,
  getAnalysesForCV,
  pickLatestJobMatch,
} from "./data";
import AutoRefresher from "@/components/analysis/analysisCVAutoRefresher";
import AnalyzeFormClient from "@/components/jobMatcher/AnalyzeFormClient";
import DeleteJobButton from "@/components/jobMatcher/DeleteJobButton";
import {
  BarChart, Briefcase, History, Sparkles, CheckCircle, Loader2,
} from "lucide-react";
import React from "react";

type AnalysisResult = {
  overallScore: number;
  summary: string;
  actionableNextSteps?: string[];
};

type Analysis = {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  cvId: string;
  result: AnalysisResult;
};

type JobMatcherPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function JobMatcherPage({
  searchParams,
}: JobMatcherPageProps) {
  const [cvs, jobs] = await Promise.all([getCVs(), getUserJobs()]);
  const selectedCvId = (searchParams?.cv as string) || cvs[0]?.id || "";
  const init = Boolean(searchParams?.init);
  const rawAnalyses = selectedCvId ? await getAnalysesForCV(selectedCvId) : [];
  const analyses: Analysis[] = rawAnalyses.map((a: any) => ({
    ...a,
    result: a.result as AnalysisResult,
    cvId: a.cvId,
    updatedAt: a.updatedAt,
  }));
  const latestJobMatch = pickLatestJobMatch(analyses);

  // Status waiting dapat (dan biasanya) dihandle oleh server logic, yakni:
  const waiting: boolean =
    !!selectedCvId &&
    init &&
    (!latestJobMatch || latestJobMatch.status?.toUpperCase() !== "COMPLETED");

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <header className="max-w-5xl mx-auto pt-10 pb-4 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-[#162B60] tracking-tight mb-1">
          Job Matcher
        </h1>
        <p className="text-gray-500 font-medium">
          Analyze your resume and saved jobs with AI-driven job matching.
        </p>
      </header>
      <main className="max-w-5xl mx-auto px-2 md:px-0 pb-16">
        <section className="space-y-7">
          {/* EVALUATE */}
          <div className="rounded-2xl shadow bg-white p-6 md:p-8 mb-0">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-[#162B60]" />
              <h2 className="text-lg font-semibold tracking-tight text-[#162B60]">
                Evaluate with Job Posting
              </h2>
            </div>
            {/* Modal overlay if waiting */}
            {waiting && (
              <ModalLoader />
            )}
            {waiting
              ? <WaitingPanel />
              : <AnalyzeFormClient cvs={cvs} jobs={jobs} selectedCvId={selectedCvId} />
            }
          </div>
          <br />

          {/* LATEST MATCH RESULT (now under Evaluate, before grid) */}
          {!waiting && latestJobMatch?.status?.toUpperCase() === "COMPLETED" && (
            <div className="rounded-2xl shadow bg-white p-6 md:p-8 mt-0">
              <div className="flex items-center gap-2 mb-4">
                <BarChart className="w-6 h-6 text-emerald-500" />
                <h2 className="text-lg font-semibold tracking-tight text-[#162B60]">
                  Latest Match Result
                </h2>
              </div>
              <ResultSummary
                result={latestJobMatch.result as AnalysisResult}
                when={latestJobMatch.createdAt}
              />
            </div>
          )}

          {/* GRID: Saved Jobs / Analysis History */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl shadow bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-6 h-6 text-[#162B60]" />
                <h3 className="font-semibold text-[#162B60] text-lg tracking-tight">
                  Saved Jobs
                </h3>
              </div>
              {jobs.length ? (
                <ul className="space-y-2">
                  {jobs.map((job) => (
                    <li
                      key={job.id}
                      className="flex items-center justify-between rounded-md hover:bg-[#f6f8fd] px-4 py-2 transition"
                    >
                      <div className="min-w-0">
                        <span className="font-medium text-[#162B60]">
                          {job.title}
                        </span>
                        {job.company && (
                          <span className="text-gray-500"> · {job.company}</span>
                        )}
                        <div className="text-xs text-gray-400 truncate">
                          Saved {formatDate(job.createdAt)}
                        </div>
                      </div>
                      <form
                        action={async () => {
                          "use server";
                          await deleteJobAction(job.id, selectedCvId);
                        }}
                      >
                        <DeleteJobButton jobId={job.id} currentCvId={selectedCvId} />
                      </form>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[15px] text-gray-400 text-center py-10">
                  No saved jobs yet.
                </div>
              )}
            </div>
            <JobMatchHistory analyses={analyses} />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ===== Modal Loader Component ===== */

function ModalLoader() {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-20 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg px-10 py-7 flex flex-col items-center border border-[#162B60]/10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#162B60] mb-4" />
        <div className="font-bold text-[#162B60] text-lg mb-2">
          Your analysis is being processed...
        </div>
        <div className="text-gray-500 text-sm text-center">
          Please wait while we analyze your resume with the selected job posting.
        </div>
      </div>
    </div>
  );
}

/* ===== Waiting Panel ===== */
function WaitingPanel() {
  return (
    <div className="rounded-xl bg-[#F3F8FF] py-8 text-center">
      <div className="relative mx-auto h-14 w-14 mb-2">
        <div
          className="h-14 w-14 rounded-full"
          style={{
            background: `conic-gradient(#2563eb 120deg, #e5e7eb 0deg)`
          }}
        />
        <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center shadow">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
        </div>
      </div>
      <div className="font-semibold text-[#162B60] mt-2 text-base">
        Running <span className="text-blue-600">Job Match Analysis</span>
      </div>
      <p className="text-sm text-slate-500 mt-1">
        Please wait. The page will refresh automatically.
      </p>
      <div className="mt-3">
        <AutoRefresher intervalMs={3000} />
      </div>
    </div>
  );
}

/* ===== Result Summary ===== */
type ResultSummaryProps = {
  result: AnalysisResult;
  when: string;
};

function ResultSummary({ result, when }: ResultSummaryProps) {
  const score: number | null =
    typeof result?.overallScore === "number"
      ? Math.max(0, Math.min(100, result.overallScore))
      : null;

  const getScoreColor = (s: number) =>
    s > 75 ? "text-emerald-600" : s > 50 ? "text-yellow-500" : "text-red-500";

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {score !== null && (
          <div className="w-11 h-11 relative flex items-center justify-center mr-1">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle
                className="text-gray-200"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                cx="18"
                cy="18"
                r="16"
              />
              <circle
                className={getScoreColor(score)}
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                cx="18"
                cy="18"
                r="16"
                strokeDasharray={`${score * 1.01}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-sm font-bold text-[#162B60]">{score}</span>
          </div>
        )}
        <div className="text-xs text-gray-400 mt-1">
          {`Generated at ${formatDate(when)}`}
        </div>
      </div>
      {result?.summary && (
        <div className="mb-2 mt-3">
          <div className="font-semibold text-[#162B60] text-[15px] mb-1">Summary</div>
          <p className="text-sm text-gray-700">{result.summary}</p>
        </div>
      )}
      {!!result?.actionableNextSteps?.length && (
        <div className="mt-2">
          <div className="font-semibold text-[#162B60] text-[15px] mb-1">Actionable Next Steps</div>
          <ul className="space-y-1 pl-4 list-disc text-sm text-gray-700">
            {result.actionableNextSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ===== History Card ===== */
type JobMatchHistoryProps = {
  analyses: Analysis[];
};

function JobMatchHistory({ analyses }: JobMatchHistoryProps) {
  const items = (analyses ?? [])
    .filter((a) => a.type?.toUpperCase() === "JOB_MATCH_ANALYSIS")
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const statusChip = (status: string) => {
    const isDone = status.toUpperCase() === "COMPLETED";
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${isDone ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}>
        {isDone ? "Completed" : "In Progress"}
      </span>
    );
  };

  return (
    <div className="rounded-2xl shadow bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-6 h-6 text-[#162B60]" />
        <h3 className="font-semibold text-[#162B60] text-lg tracking-tight">
          Analysis History
        </h3>
      </div>
      {!items.length ? (
        <div className="text-[15px] text-gray-400 text-center py-10">
          Your job match results will appear here.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li key={a.id} className="flex justify-between items-center rounded-md px-4 py-2 hover:bg-[#f6f8fd] transition">
              <div>
                <div className="flex items-center gap-2">
                  {statusChip(a.status)}
                  {typeof a.result?.overallScore === "number" && (
                    <span className="ml-2 text-xs font-semibold text-[#162B60]">
                      Score: {Math.round(a.result.overallScore)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400">{formatDate(a.createdAt)} · ID: {a.id.slice(0, 6)}…</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
