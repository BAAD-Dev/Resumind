"use client";

import { useEffect, useMemo, useState } from "react";

const STAGES = [
  { title: "Preparing analysis engine", desc: "Parsing document metadata…" },
  { title: "Extracting text", desc: "Reading and normalizing your CV…" },
  { title: "Matching ATS keywords", desc: "Tech stack and soft skills…" },
  {
    title: "Scoring & composing feedback",
    desc: "Drafting actionable suggestions…",
  },
];

export default function Loading() {
  const [step, setStep] = useState(0);

  // Simulated progress for a lively UI (doesn't affect the real server process)
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % STAGES.length), 1400);
    return () => clearInterval(t);
  }, []);

  const pct = useMemo(
    () => Math.round(((step + 1) / STAGES.length) * 100),
    [step]
  );

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header / Hero */}
      <div className="relative overflow-hidden rounded-2xl border bg-white p-6">
        <div className="pointer-events-none absolute -inset-20 bg-gradient-to-br from-blue-50 via-transparent to-transparent blur-3xl" />
        <div className="relative flex items-center justify-between gap-6">
          {/* Progress ring */}
          <div className="relative h-24 w-24 shrink-0">
            <div
              className="h-24 w-24 rounded-full"
              style={{
                background: `conic-gradient(#2563eb ${
                  pct * 3.6
                }deg, #e5e7eb 0deg)`,
              }}
            />
            <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-semibold leading-none">{pct}</div>
                <div className="text-[10px] text-slate-500">/100</div>
              </div>
            </div>
          </div>

          {/* Title + progress bar */}
          <div className="flex-1">
            <h1 className="text-xl font-semibold">
              Running <span className="text-blue-600">CV Analysis</span>
            </h1>
            <p className="text-slate-600 mt-1">
              Please wait a moment. This page will refresh automatically when
              results are ready.
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Small spinner */}
          <div className="hidden md:flex h-10 w-10 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
          </div>
        </div>

        {/* Steps */}
        <ul className="relative mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STAGES.map((s, i) => (
            <li
              key={s.title}
              className={`rounded-lg border p-4 transition ${
                i <= step ? "bg-blue-50/60 border-blue-200" : "bg-slate-50/60"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-2 w-2 rounded-full ${
                    i <= step ? "bg-blue-600" : "bg-slate-300"
                  }`}
                />
                <div>
                  <div
                    className={`text-sm font-medium ${
                      i <= step ? "text-slate-900" : "text-slate-600"
                    }`}
                  >
                    {s.title}
                  </div>
                  {i === step ? (
                    <div className="text-xs text-slate-500 mt-0.5">
                      {s.desc}
                    </div>
                  ) : (
                    <div className="mt-2 h-2 w-28 rounded bg-slate-200/70" />
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Result skeletons (preview of final layout) */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <SkeletonCard title="Professional Summary" lines={4} />
          <SkeletonCard title="Section Breakdown" lines={6} />
        </div>
        <div className="space-y-4">
          <SkeletonCard title="Actionable Next Steps" lines={5} />
          <SkeletonCard title="Skills" lines={3} />
        </div>
      </div>
    </div>
  );
}

function SkeletonCard({ title, lines = 3 }: { title: string; lines?: number }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-3 h-4 w-48 rounded bg-slate-200" aria-label={title} />
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 w-full rounded bg-slate-100 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
