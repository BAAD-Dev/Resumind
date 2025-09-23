import { CVItem } from "@/app/myresume/resume/data";
import { formatDate } from "@/lib/format";
import Link from "next/link";

const CVlist = ({ item }: { item: CVItem }) => {
  const ext = (() => {
    const url = item.originalName || item.fileUrl;
    const m = url.match(/\.([a-zA-Z0-9]+)$/);
    return m?.[1]?.toUpperCase() ?? "FILE";
  })();

  return (
    <div className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:shadow transition">
      {/* Kiri: ikon + detail */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold">
          {ext}
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium" title={item.originalName}>
            {item.originalName}
          </div>
          <div className="text-xs text-slate-500">
            Diunggah: {formatDate(item.createdAt)}
          </div>
          {item.expiresAt && (
            <div className="text-xs text-amber-600">
              Kedaluwarsa: {formatDate(item.expiresAt)}
            </div>
          )}
        </div>
      </div>

      {/* Kanan: tombol aksi */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={item.fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
        >
          Buka
        </a>
        <Link
          href={`./resume/${item.id}`}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-3 py-1.5 text-sm hover:bg-blue-700"
        >
          Analysis CV
        </Link>
      </div>
    </div>
  );
};

export default CVlist;
