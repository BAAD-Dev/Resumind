export function Mini({
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
