export function Header({ overall }: { overall: number }) {
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
