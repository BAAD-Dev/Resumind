"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDropzone, FileRejection } from "react-dropzone";
import Swal from "sweetalert2";
import "animate.css";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  InformationCircleIcon,
  StarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

// --- Constants ---
const PRIMARY_BLUE = "#162B60";
const PREMIUM_GOLD = "#FFD700";
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// --- TypeScript Types ---
type AnalyzeResponse = {
  overallScore: string;
  summary: string;
};

type Props = {
  user: { role: string } | null;
};

// --- Helper Component for Status Icon ---
const StateIcon = ({
  state,
}: {
  state: "uploading" | "success" | "error" | null;
}) => {
  if (state === "uploading") {
    return (
      <div
        className="animate-spin rounded-full h-8 w-8 border-b-2"
        style={{ borderColor: PRIMARY_BLUE }}
      />
    );
  }
  if (state === "success") {
    return (
      <svg
        className="h-8 w-8 text-green-600"
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
  }
  if (state === "error") {
    return (
      <svg
        className="h-8 w-8 text-red-600"
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
  }
  return null;
};

// --- Main Client Component ---
export default function AnalyzeClient({ user }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "uploading" | "success" | "error" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const showSwalAlert = (icon: "error" | "success", title: string) => {
    Swal.fire({
      icon,
      title,
      showClass: {
        popup: "animate__animated animate__fadeInUp animate__faster",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__faster",
      },
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const firstError = fileRejections[0].errors[0];
        if (firstError.code === "file-too-large") {
          showSwalAlert("error", `File is larger than ${MAX_FILE_SIZE_MB}MB.`);
        } else {
          showSwalAlert("error", "Only one PDF file is permitted.");
        }
        return;
      }
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setStatus(null);
        setErrorMessage("");
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    maxSize: MAX_FILE_SIZE_BYTES,
  });

  const removeFile = () => {
    setFile(null);
    setStatus(null);
    setErrorMessage("");
  };

  const handleAnalyze = async () => {
    if (!file) {
      showSwalAlert("error", "Please upload a PDF file first.");
      return;
    }
    setStatus("uploading");
    setErrorMessage("");
    try {
      const fd = new FormData();
      fd.append("cv", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/analysis/guest/cv`,
        { method: "POST", body: fd }
      );
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: `Server error: ${res.status}` }));
        throw new Error(
          errorData.message || `Upload failed with status: ${res.status}`
        );
      }
      const result = (await res.json()) as AnalyzeResponse;
      setStatus("success");
      Swal.fire({
        title: '<strong style="color: #162B60;">Analysis Complete!</strong>',
        html: `
          <div style="text-align: left; padding: 1rem;">
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
              <h3 style="font-weight: 600; color: #166534; margin-bottom: 0.5rem;">Overall Score</h3>
              <p style="color: #15803d;">${result.overallScore}</p>
            </div>
            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 1rem;">
              <h3 style="font-weight: 600; color: #1e40af;">Summary</h3>
              <p style="color: #1e3a8a; line-height: 1.6;">${result.summary}</p>
            </div>
          </div>`,
        showCloseButton: true,
        focusConfirm: false,
        confirmButtonText: "Great!",
        confirmButtonColor: PRIMARY_BLUE,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setStatus("error");
      setErrorMessage(message);
      showSwalAlert("error", message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl p-6">
        <div className="relative text-center mb-4">
          <Link href="/" className="absolute top-1/2 left-0 -translate-y-1/2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
          </Link>
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/logo_new.png"
              alt="resumind_logo"
              width={150}
              height={30}
              className="object-contain mb-1"
              priority
            />
            <p className="text-gray-600 mt-1 text-sm text-center">
              Get AI-powered insights and improve your resume for the right job!
            </p>
          </div>
        </div>

        <div
          style={{ background: PRIMARY_BLUE }}
          className="rounded-lg px-4 py-3 flex items-center justify-between mb-4 gap-2"
        >
          <div className="flex items-center gap-2">
            <InformationCircleIcon className="h-5 w-5 text-white" />
            <h2 className="font-semibold text-white text-base">
              Upload Your Resume or CV
            </h2>
          </div>
          <button
            onClick={() => setShowDisclaimer(true)}
            className="bg-white text-xs text-black rounded px-3 py-1 font-semibold hover:bg-gray-100"
          >
            Learn more
          </button>
        </div>

        <div
          className="mb-6 p-4 border rounded-lg bg-blue-50"
          style={{ borderColor: PRIMARY_BLUE }}
        >
          <ul className="text-sm text-blue-900 space-y-2">
            <li>• Resume or CVs are stored temporarily for analysis only</li>
            <li>• All files are deleted within 24 hours</li>
            <li>• Results are AI-generated, not 100% factual</li>
            <li>• Only PDF accepted, max {MAX_FILE_SIZE_MB}MB</li>
          </ul>
        </div>

        {/* --- Conditionally Rendered Dropzone --- */}
        {!file && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer ${
              isDragActive
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 hover:border-blue-500 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <div
                className="p-3 bg-gray-100 rounded-full mb-4"
                style={{ border: `1px solid ${PRIMARY_BLUE}` }}
              >
                <ArrowUpTrayIcon
                  className="h-8 w-8"
                  style={{ color: PRIMARY_BLUE }}
                />
              </div>
              <p className="text-gray-700 font-medium">
                {isDragActive
                  ? "Drop the file here..."
                  : "Drag & drop your PDF or click to select"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                PDF only • Max {MAX_FILE_SIZE_MB}MB
              </p>
            </div>
          </div>
        )}

        {/* --- Uploaded File Box --- */}
        {file && (
          <div className="mt-6">
            <div
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
              style={{ borderColor: PRIMARY_BLUE }}
            >
              <div className="flex items-center gap-3">
                <StateIcon state={status} />
                <div>
                  <p className="font-medium text-gray-900 break-all">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {status === "error" && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{errorMessage}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-4 w-full">
          <button
            onClick={handleAnalyze}
            disabled={!file || status === "uploading"}
            className="w-full font-bold py-3 px-6 rounded-lg text-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: PRIMARY_BLUE, color: "white" }}
          >
            {status === "uploading" ? "Analyzing..." : "Analyze Now"}
          </button>
          {!user && (
            <Link href="/register" className="w-full">
              <button
                className="w-full font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-2 border"
                style={{
                  background: "#FFF8E5",
                  color: "#AA8600",
                  borderColor: PREMIUM_GOLD,
                }}
              >
                <StarIcon className="h-6 w-6" style={{ color: PREMIUM_GOLD }} />
                Get Premium Plan
              </button>
            </Link>
          )}
        </div>
      </div>

      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDisclaimer(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg border border-blue-900">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: PRIMARY_BLUE }}>
                Legal & Privacy Disclaimer
              </h3>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="text-sm text-gray-800 space-y-4">
              <div>
                <h4 className="font-semibold" style={{ color: PRIMARY_BLUE }}>
                  Privacy
                </h4>
                <p>
                  Your Resume or CV is temporarily stored only for analysis
                  purposes and deleted within 24 hours. We respect your
                  privacy—your data is never shared or sold.
                </p>
              </div>
              <div>
                <h4 className="font-semibold" style={{ color: PRIMARY_BLUE }}>
                  AI Results
                </h4>
                <p>
                  All results are generated by AI and may not be 100% accurate.
                  Consider these only as suggestions, not definitive facts.
                  Results may vary between analyses.
                </p>
              </div>
              <div>
                <h4 className="font-semibold" style={{ color: PRIMARY_BLUE }}>
                  Requirements
                </h4>
                <p>
                  Only PDF files allowed, max size 5MB. Upload the correct
                  format for best results.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="px-4 py-2 text-white rounded-lg font-medium"
                style={{ background: PRIMARY_BLUE }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
