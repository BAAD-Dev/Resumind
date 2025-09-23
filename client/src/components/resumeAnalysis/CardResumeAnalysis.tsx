export function Card({
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
