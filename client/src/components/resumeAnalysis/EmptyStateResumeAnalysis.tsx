export function EmptyState({ title, desc }: { title: string; desc?: string }) {
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
