import UploadDropzone from "@/components/resume/Dropzone";
import { CVItem, getCVs } from "./data";
import { uploadCV } from "./action";
import CVlist from "@/components/resume/CVCard";

export const dynamic = "force-dynamic";

export default async function ResumePage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const data = await getCVs();

  const msg =
    typeof searchParams?.msg === "string"
      ? (searchParams.msg as string)
      : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
              MyResume / Resume
            </h1>
            <p className="text-sm text-slate-500">
              Upload CV kamu dan kelola daftar file di bawah
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-10">
        {/* Upload */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <h2 className="text-lg font-medium">Upload CV</h2>
          </div>

          {/* fieldName default 'cv'; ganti jika backend berbeda */}
          <UploadDropzone
            action={uploadCV}
            accept=".pdf,.doc,.docx,.txt,.rtf"
          />

          {msg && (
            <div
              className="mt-4 rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-800 p-3"
              aria-live="polite"
            >
              {msg}
            </div>
          )}
        </section>

        {/* List */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">List CV</h2>
            <div className="text-sm text-slate-500">{data.length} file</div>
          </div>

          {data.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600">
              Belum ada file yang diupload.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {data.map((it: CVItem) => (
                <CVlist key={it.id} item={it} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
