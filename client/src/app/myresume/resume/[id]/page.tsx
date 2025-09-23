export const dynamic = "force-dynamic";
import AutoRefresher from "@/components/analysis/analysisCVAutoRefresher";
import { getAnalysesByCvId, pickBestAnalysis } from "./data";
import { requestAnalysis } from "./action";
import { redirect } from "next/navigation";

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
        <h2 className="text-xl font-semibold">Menjalankan analisis…</h2>
        <p className="text-slate-600 mt-2">
          Ini bisa memakan beberapa detik. Halaman akan menyegarkan otomatis.
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
            ? "Analisis sedang diproses"
            : "Analisis belum siap"
        }
        desc="Silakan tunggu beberapa saat lalu refresh halaman."
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

/* ===== UI helpers (sama seperti sebelumnya) ===== */
function Header({ overall }: { overall: number }) {
  const v = Math.max(0, Math.min(100, overall ?? 0));
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-6">
        <div className="relative h-20 w-20">
          <div
            className="h-20 w-20 rounded-full"
            style={{
              background: `conic-gradient(#2563eb ${v * 3.6}deg, #e5e7eb 0deg)`,
            }}
          />
          <div className="absolute inset-0 m-2 rounded-full bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="text-xl font-semibold leading-none">{v}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">/ 100</div>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Overall Score</h1>
          <p className="text-slate-600">CV Analysis</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50">
          Export PDF
        </button>
        <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
          Share
        </button>
      </div>
    </div>
  );
}

function Card({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border bg-white p-5 ${className ?? ""}`}>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  if (!items?.length) return <div className="text-slate-400 text-sm">—</div>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((s, i) => (
        <span
          key={i}
          className="inline-flex items-center rounded-md border px-2.5 py-1 text-xs bg-slate-50"
        >
          {s}
        </span>
      ))}
    </div>
  );
}

function Mini({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-slate-50/60 p-3">
      <div className="text-sm font-semibold mb-1">{title}</div>
      {children}
    </div>
  );
}

function Bar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
      <div className="h-full bg-blue-600" style={{ width: `${v}%` }} />
    </div>
  );
}

function List({ bullets }: { bullets: string[] }) {
  if (!bullets?.length) return <div className="text-slate-400 text-sm">—</div>;
  return (
    <ul className="list-disc pl-5 space-y-2 text-slate-700">
      {bullets.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}

function EmptyState({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border bg-white p-8 text-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      {desc && <p className="text-slate-600 mt-2">{desc}</p>}
      <div className="mt-4">
        <form action="">
          <button
            formAction={async () => {
              "use server"; /* refresh noop */
            }}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
          >
            Refresh
          </button>
        </form>
      </div>
    </div>
  );
}
