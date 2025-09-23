export function Chips({ items }: { items: string[] }) {
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
