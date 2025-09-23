"use client";

import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export type UploadResult = { ok: boolean; message?: string } | void;

function hasDigest(e: unknown): e is { digest: unknown } {
  return typeof e === "object" && e !== null && "digest" in e;
}

function isNextRedirectError(e: unknown): boolean {
  return (
    hasDigest(e) &&
    typeof e.digest === "string" &&
    e.digest.startsWith("NEXT_REDIRECT")
  );
}
function getErrorMessage(e: unknown): string {
  if (e instanceof Error && typeof e.message === "string") return e.message;
  if (typeof e === "string") return e;
  if (typeof e === "object" && e !== null && "message" in e) {
    const m = (e as { message?: unknown }).message;
    return typeof m === "string" ? m : "";
  }
  return "";
}

export default function UploadDropzone({
  action,
  fieldName = "cv",
  accept = ".pdf,.doc,.docx,.txt,.rtf",
  buttonText = "Upload",
  maxSizeMB = 10,
}: {
  action: (formData: FormData) => Promise<UploadResult>;
  fieldName?: string;
  accept?: string;
  buttonText?: string;
  maxSizeMB?: number;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const acceptExts = useMemo(
    () =>
      accept
        .split(",")
        .map((s) => s.trim().replace(/^\./, ""))
        .filter(Boolean),
    [accept]
  );

  const validate = useCallback(
    (f: File): string | null => {
      if (!f) return "File tidak ditemukan";
      const sizeOK = f.size <= maxSizeMB * 1024 * 1024;
      if (!sizeOK) return `Ukuran file melebihi ${maxSizeMB}MB`;
      const ext = f.name.split(".").pop()?.toLowerCase();
      if (ext && acceptExts.length && !acceptExts.includes(ext)) {
        return `Tipe file .${ext} tidak didukung`;
      }
      return null;
    },
    [maxSizeMB, acceptExts]
  );

  const onSelect = useCallback(
    (f: File | undefined) => {
      setMessage(null);
      if (!f) return;

      const err = validate(f);
      if (err) {
        toast.error(err);
        setMessage(`❌ ${err}`);
        return;
      }
      setFile(f);
    },
    [validate]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      onSelect(f);
    },
    [onSelect]
  );

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const openPicker = () => inputRef.current?.click();

  const clear = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async () => {
    const chosen = file ?? inputRef.current?.files?.[0] ?? null;
    if (!chosen) {
      setMessage("Pilih atau drop file dulu ya ✨");
      inputRef.current?.focus();
      return;
    }

    const err = validate(chosen);
    if (err) {
      toast.error(err);
      setMessage(`❌ ${err}`);
      return;
    }

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append(fieldName, chosen);
        const res = await action(fd);
        if (res && typeof res === "object" && "ok" in res) {
          if (res.ok) {
            toast.success("upload success");
            clear();
            router.refresh();
          } else {
            toast.error(`${res.message} Upload Failed`);
          }
        } else {
        }
      } catch (e: unknown) {
        if (isNextRedirectError(e)) return;
        const msg = getErrorMessage(e) || "Terjadi kesalahan saat upload";
        toast.error(msg);
      }
    });
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={openPicker}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openPicker()}
        className={[
          "group relative rounded-2xl border-2 border-dashed p-8 transition cursor-pointer",
          isDragging
            ? "border-blue-500 bg-blue-50/60"
            : "border-slate-300 bg-slate-50 hover:bg-slate-100",
          isPending && "opacity-80",
        ]
          .filter(Boolean)
          .join(" ")}
        aria-busy={isPending}
        aria-label="Dropzone unggah file">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute -inset-x-20 -top-1/2 h-full rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex flex-col items-center text-center gap-3">
          {!file ? (
            // === Empty State ===

            <div className="flex flex-col items-center justify-center text-center space-y-1">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="opacity-80">
                <path
                  d="M12 16V4m0 0 4 4m-4-4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="text-base sm:text-lg font-medium">
                Tarik & letakkan file di sini
              </div>
              <div className="text-xs sm:text-sm text-slate-500">
                atau klik untuk memilih (maks {maxSizeMB}MB)
              </div>
            </div>
          ) : (
            // === File State ===
            <div className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
              {/* Icon dokumen */}
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md bg-slate-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-slate-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>

              {/* Nama file */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium text-slate-700 truncate"
                  title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">Dokumen terpilih</p>
              </div>

              {/* Tombol hapus */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clear();
                }}
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                aria-label="Hapus file terpilih">
                ×
              </button>
            </div>
          )}

          <input
            ref={inputRef}
            name={fieldName}
            type="file"
            accept={accept}
            onChange={(e) => onSelect(e.target.files?.[0])}
            className="sr-only"
          />

          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openPicker();
              }}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50">
              Pilih File
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSubmit();
              }}
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-blue-700 disabled:opacity-60">
              {isPending ? "Uploading…" : buttonText}
            </button>
          </div>
        </div>

        {isPending && (
          <div className="absolute inset-0 rounded-2xl bg-white/60 backdrop-blur-[2px] grid place-items-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          </div>
        )}
      </div>

      {message && (
        <div
          className="rounded-lg border border-slate-200 bg-white text-sm text-slate-700 p-3"
          aria-live="polite">
          {message}
        </div>
      )}
    </div>
  );
}
