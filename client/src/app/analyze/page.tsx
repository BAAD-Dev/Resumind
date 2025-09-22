"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";

type AnalyzeResponse = {
  overallScore: string;
  summary: string;
};

const StateIcon = ({
  state,
}: {
  state: "uploading" | "success" | "error" | null;
}) => {
  if (state === "uploading")
    return (
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    );
  if (state === "success")
    return (
      <svg
        className="h-8 w-8 text-success"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  if (state === "error")
    return (
      <svg
        className="h-8 w-8 text-danger"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
    );
  return null;
};

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null); // <= single file
  const [status, setStatus] = useState<
    "uploading" | "success" | "error" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Hanya PDF
    const pdfFiles = acceptedFiles.filter((f) => f.type === "application/pdf");
    if (acceptedFiles.length > 1 || pdfFiles.length > 1) {
      alert("Hanya boleh unggah 1 file PDF.");
      return;
    }
    if (pdfFiles.length === 0) {
      alert("Hanya file PDF yang diperbolehkan.");
      return;
    }
    // Ambil file pertama dan replace state
    setFile(pdfFiles[0]);
    setStatus(null);
    setErrorMessage("");
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false, // <= kunci single file
    maxFiles: 1, // <= kunci single file
  });

  // Bersihkan object URL kalau sebelumnya pernah dipakai untuk preview (opsional)
  useEffect(() => {
    return () => {
      // if you created URL.createObjectURL(file) somewhere, revoke here
    };
  }, []);

  const removeFile = () => {
    setFile(null);
    setStatus(null);
    setErrorMessage("");
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Silakan unggah 1 file PDF terlebih dahulu.");
      return;
    }
    // Validasi: PDF & <= 5MB
    if (file.type !== "application/pdf") {
      setStatus("error");
      setErrorMessage("Hanya PDF yang diperbolehkan.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("error");
      setErrorMessage("Ukuran maksimum 5 MB.");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("cv", file); // nama field harus sama dengan backend

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/analysis/guest/cv`,
        {
          method: "POST",
          body: fd,
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Upload gagal (${res.status})`);
      }
      const data = (await res.json()) as AnalyzeResponse;
      setResult(data);
      setStatus("success");
      setOpen(true);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(
        err?.message || "Terjadi kesalahan saat mengunggah/menganalisis."
      );
    }
  };

  return (
    <div className="bg-muted min-h-screen flex items-center justify-center font-sans">
      <div className="w-full max-w-2xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground">
            Analyze Your CV with AI
          </h1>
          <p className="text-slate-600 mt-2">
            Get instant feedback to improve your resume and match with the right
            jobs.
          </p>
        </div>

        <div className="bg-background rounded-2xl shadow-xl p-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors duration-300 ${
              isDragActive
                ? "border-primary bg-blue-50"
                : "border-gray-300 hover:border-primary"
            }`}
          >
            <input {...getInputProps({ refKey: "ref" })} ref={inputRef} />
            <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
            {isDragActive ? (
              <p className="mt-2 text-primary">Drop the file here ...</p>
            ) : (
              <p className="mt-2 text-slate-600">
                Drag & drop your CV here, or click to select 1 PDF file
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">PDF only, max 5MB</p>
          </div>

          {file && (
            <div className="mt-6">
              <h3 className="font-semibold text-foreground">Uploaded File:</h3>
              <div className="mt-2 p-4 bg-muted rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <StateIcon state={status} />
                  <p className="text-foreground font-medium">{file.name}</p>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 rounded-full hover:bg-slate-200"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              {status === "error" && (
                <p className="text-sm text-danger mt-2">{errorMessage}</p>
              )}
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleAnalyze}
              disabled={!file || status === "uploading"}
              className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-primary-dark transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {status === "uploading" && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              )}
              {status === "uploading" ? "Analyzing..." : "Analyze My CV"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold">Hasil Analisis</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup modal"
                className="rounded p-1 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {status === "error" && (
              <p className="mt-4 text-sm text-danger">
                {errorMessage || "Terjadi kesalahan."}
              </p>
            )}

            {status === "success" && result && (
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-medium">Overall Score:</span>{" "}
                  {result.overallScore}
                </p>
                <p>
                  <span className="font-medium">Summary:</span>
                  <br />
                  {result.summary}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded border px-4 py-2"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
