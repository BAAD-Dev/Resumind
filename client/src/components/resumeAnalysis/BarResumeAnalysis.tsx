export function Bar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value ?? 0));
  return (
    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
      <div className="h-full bg-blue-600" style={{ width: `${v}%` }} />
    </div>
  );
}
