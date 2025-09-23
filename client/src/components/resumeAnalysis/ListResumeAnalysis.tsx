export function List({ bullets }: { bullets: string[] }) {
  if (!bullets?.length) return <div className="text-slate-400 text-sm">—</div>;
  return (
    <ul className="list-disc pl-5 space-y-2 text-slate-700">
      {bullets.map((b, i) => (
        <li key={i}>{b}</li>
      ))}
    </ul>
  );
}
