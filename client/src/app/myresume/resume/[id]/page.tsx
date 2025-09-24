export const dynamic = "force-dynamic";
import AutoRefresher from "@/components/analysis/analysisCVAutoRefresher";
import { getAnalysesByCvId, pickBestAnalysis } from "./data";
import { requestAnalysis } from "./action";
import { redirect } from "next/navigation";
import { Header } from "@/components/resumeAnalysis/Header";
import { Card } from "@/components/resumeAnalysis/CardResumeAnalysis";
import { List } from "@/components/resumeAnalysis/ListResumeAnalysis";
import { Chips } from "@/components/resumeAnalysis/ChipsResumeAnalysis";
import { Bar } from "@/components/resumeAnalysis/BarResumeAnalysis";
import { Mini } from "@/components/resumeAnalysis/MiniResumeAnalysis";
import { EmptyState } from "@/components/resumeAnalysis/EmptyStateResumeAnalysis";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const list = await getAnalysesByCvId(params.id);
  const analysis = pickBestAnalysis(list);

  if (!analysis) {
    if (!analysis && !searchParams?.init) {
      await requestAnalysis(params.id);
      redirect(`/myresume/resume/${params.id}?init=1`);
    }
    return (
      <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 text-center">
        <h2 className="text-xl font-semibold">Running...</h2>
        <p className="text-slate-600 mt-2">
          Please wait a moment. This page will refresh automatically when results are ready.
        </p>
        <AutoRefresher intervalMs={3000} />
      </div>
    );
  }

  const r = analysis.result ?? null;

  if (!r) {
    return (
      <EmptyState
        title={
          analysis.status?.toUpperCase() === "PENDING"
            ? "Analysis in progress"
            : "Analysis not ready yet"
        }
        desc="Please wait a moment then refresh the page."
      />
    );
  }

  const tech = r.extractedKeywords?.technicalSkills ?? [];
  const soft = r.extractedKeywords?.softSkills ?? [];

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-8">
      <Header overall={r.overallScore} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Professional Summary" className="lg:col-span-2">
          <p className="text-slate-700 leading-relaxed">{r.summary}</p>
        </Card>
        <Card title="Actionable Next Steps">
          <List bullets={r.actionableNextSteps ?? []} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Technical Skills">
          <Chips items={tech} />
        </Card>
        <Card title="Soft Skills">
          <Chips items={soft} />
        </Card>
      </div>

      <Card title="Section Breakdown">
        <div className="space-y-6">
          {(r.sectionBreakdown ?? []).map((sec, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{sec.sectionName}</div>
                  <div className="text-sm text-slate-600">{sec.score}</div>
                </div>
                <Bar value={sec.score} />
                <div className="text-xs text-slate-500 mt-1">Score</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Mini title="What’s good">
                  <p className="text-sm text-slate-700">
                    {sec.positiveFeedback}
                  </p>
                </Mini>
                <Mini title="What to improve">
                  <p className="text-sm text-slate-700">
                    {sec.improvementSuggestions}
                  </p>
                </Mini>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Improved Summary">
          <p className="text-slate-700 leading-relaxed">
            {r.rewrittenContent?.improvedSummary ?? "—"}
          </p>
        </Card>
        <Card title="Improved Experience Bullets">
          {r.rewrittenContent?.improvedExperienceBullets?.length ? (
            <List bullets={r.rewrittenContent.improvedExperienceBullets} />
          ) : (
            <p className="text-slate-500">—</p>
          )}
        </Card>
      </div>
    </div>
  );
}
