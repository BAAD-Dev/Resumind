import { formatDate } from "@/lib/format";
import { deleteJobAction } from "./action";
import {
  getCVs,
  getUserJobs,
  getAnalysesForCV,
  pickLatestJobMatch,
} from "./data";
import AnalyzeFormClient from "@/components/jobMatcher/AnalyzeFormClient";
import DeleteJobButton from "@/components/jobMatcher/DeleteJobButton";
import ModalLoader from "@/components/jobMatcher/ModalLoader";
import WaitingPanel from "@/components/jobMatcher/WaitingPanel";
import ResultSummary from "@/components/jobMatcher/ResultSummary";
import JobMatchHistory from "@/components/jobMatcher/JobMatchHistory";
import { AnalysisResult, Analysis, RawAnalysis } from "@/components/jobMatcher/types";
import {
  BarChart, Briefcase, Sparkles,
} from "lucide-react";
import React from "react";

// ✅ Perubahan: searchParams jadi Promise
type JobMatcherPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function JobMatcherPage({
  searchParams,
}: JobMatcherPageProps) {
  const [cvs, jobs] = await Promise.all([getCVs(), getUserJobs()]);

  // ✅ Wajib di-await sebelum akses property
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const selectedCvId = (resolvedSearchParams?.cv as string) || cvs[0]?.id || "";
  const init = Boolean(resolvedSearchParams?.init);

  const rawAnalyses = selectedCvId ? await getAnalysesForCV(selectedCvId) : [];

  const analyses: Analysis[] = rawAnalyses.map((a: unknown) => {
    const analysis = a as RawAnalysis;
    return {
      ...analysis,
      result: analysis.result as AnalysisResult,
      cvId: analysis.cvId,
      updatedAt: analysis.updatedAt,
    };
  });

  const latestJobMatch = pickLatestJobMatch(analyses);

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
          Analyze your resume and saved jobs with AI-driven job matching.
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
            {waiting && <ModalLoader />}
            {waiting
              ? <WaitingPanel />
              : <AnalyzeFormClient cvs={cvs} jobs={jobs} selectedCvId={selectedCvId} />
            }
          </div>
          <br />

          {/* LATEST MATCH RESULT */}
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
