"use client";

import AutoRefresher from "@/components/analysis/analysisCVAutoRefresher";

export default function WaitingPanel() {
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
