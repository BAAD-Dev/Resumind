"use client";

import Link from "next/link";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    toast.error(error?.message || "Failed to load CV list");
  }, [error]);

  return (
    <>
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              Resume
            </h1>
            <p className="text-sm text-slate-500">
              Failed to load Resume data — please try again later.
            </p>
          </div>
        </div>
      </header>

      {/* Isi error */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-semibold mb-3">There is an error</h2>
          <p className="text-slate-600 mb-6">
            {error?.message || "Maaf, ada masalah saat memuat data."}
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => reset()}
              className="px-4 py-2 rounded-md bg-blue-600 text-white">
              Try Again
            </button>

            <Link
              href="/myresume/resume"
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700">
              Reload Page
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
