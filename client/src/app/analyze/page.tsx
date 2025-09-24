"use client";

import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  InformationCircleIcon,
  StarIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import "animate.css";

const PRIMARY_BLUE = "#162B60";
const PREMIUM_GOLD = "#FFD700";

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
      <div
        className="animate-spin rounded-full h-8 w-8 border-b-2"
        style={{ borderColor: PRIMARY_BLUE }}
      />
    );
  if (state === "success")
    return (
      <svg
        className="h-8 w-8"
        style={{ color: "#16a34a" }}
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
        className="h-8 w-8"
        style={{ color: "#dc2626" }}
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
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "uploading" | "success" | "error" | null
  >(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles.filter((f) => f.type === "application/pdf");
    if (acceptedFiles.length > 1 || pdfFiles.length > 1) {
      Swal.fire({
        icon: "error",
        title: "Only one PDF file is allowed.",
        showClass: { popup: "animate__animated animate__fadeInUp animate__faster" },
        hideClass: { popup: "animate__animated animate__fadeOutDown animate__faster" },
      });
      return;
    }
    if (pdfFiles.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Only PDF files are permitted.",
        showClass: { popup: "animate__animated animate__fadeInUp animate__faster" },
        hideClass: { popup: "animate__animated animate__fadeOutDown animate__faster" },
      });
      return;
    }
    setFile(pdfFiles[0]);
    setStatus(null);
    setErrorMessage("");
    setResult(null);
  }, []);

  const {
    getRootProps,
    getInputProps,
    open: openFileDialog,
    isDragActive,
  } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
    maxFiles: 1,
    noClick: true,
    noKeyboard: true,
  });

  const removeFile = () => {
    setFile(null);
    setStatus(null);
    setErrorMessage("");
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!file) {
      Swal.fire({
        icon: "error",
        title: "Please upload a PDF file first.",
        showClass: { popup: "animate__animated animate__fadeInUp animate__faster" },
        hideClass: { popup: "animate__animated animate__fadeOutDown animate__faster" },
      });
      return;
    }
    if (file.type !== "application/pdf") {
      Swal.fire({
        icon: "error",
        title: "Only PDF files are allowed.",
        showClass: { popup: "animate__animated animate__fadeInUp animate__faster" },
        hideClass: { popup: "animate__animated animate__fadeOutDown animate__faster" },
      });
      setStatus("error");
      setErrorMessage("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Maximum file size is 5MB.",
        showClass: { popup: "animate__animated animate__fadeInUp animate__faster" },
        hideClass: { popup: "animate__animated animate__fadeOutDown animate__faster" },
      });
      setStatus("error");
      setErrorMessage("Maximum file size is 5MB.");
      return;
    }

    setStatus("uploading");
    setErrorMessage("");
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("cv", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/analysis/guest/cv`,
        { method: "POST", body: fd }
      );
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        Swal.fire({
          icon: "error",
          title: text || `Upload failed (${res.status})`,
          showClass: { popup: "animate__animated animate__fadeInUp animate__faster" },
          hideClass: { popup: "animate__animated animate__fadeOutDown animate__faster" },
        });
        throw new Error(text || `Upload failed (${res.status})`);
      }
      const data = await res.json() as AnalyzeResponse;
      setResult(data);
      setStatus("success");
      setShowResult(true);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: err?.message || "An error occurred during upload/analysis.",
        showClass: { popup: "animate__animated animate__fadeInUp animate__faster" },
        hideClass: { popup: "animate__animated animate__fadeOutDown animate__faster" },
      });
      setStatus("error");
      setErrorMessage(
        err?.message || "An error occurred during upload/analysis."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans px-2 sm:px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 md:p-10">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center justify-center">
          <Image
            src="/logo_new.png"
            alt="Resumind Logo"
            width={150}
            height={40}
            className="object-contain mb-2"
            priority
          />
          <p className="text-gray-700 text-sm md:text-base text-center">
            Get AI-powered feedback to improve your resume for any opportunity.
          </p>
        </div>
        {/* Info bar */}
        <div
          style={{ background: PRIMARY_BLUE }}
          className="rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between mb-4 shadow-md"
        >
          <div className="flex items-center gap-2">
            <InformationCircleIcon className="h-6 w-6 text-white" />
            <span className="font-semibold text-white text-base">
              Upload your resume (PDF only)
            </span>
          </div>
          <button
            onClick={() => setShowDisclaimer(true)}
            className="bg-white text-sm text-blue-900 rounded px-3 py-1 font-semibold cursor-pointer hover:bg-gray-100 transition"
          >
            Legal & Privacy
          </button>
        </div>
        {/* Notice list */}
        <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 shadow-md">
          <ul className="text-xs md:text-sm text-blue-900 space-y-2">
            <li>• Files stored temporarily for analysis ONLY</li>
            <li>• All files deleted within 24 hours</li>
            <li>• Results are suggestions, NOT guarantees</li>
            <li>• Only PDF up to 5MB accepted</li>
          </ul>
        </div>
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`rounded-xl px-6 py-8 text-center transition-all duration-200 shadow-md ${
            isDragActive
              ? "bg-blue-50 ring-4 ring-blue-500"
              : "bg-gray-50 hover:ring-2 hover:ring-blue-500"
          }`}
        >
          <input {...getInputProps({ refKey: "ref" })} ref={inputRef} />
          <div className="flex flex-col items-center justify-center min-h-[120px]">
            <div
              className="p-3 bg-white rounded-full mb-5 shadow"
              style={{ border: `2px solid ${PRIMARY_BLUE}` }}
            >
              <ArrowUpTrayIcon className="h-10 w-10" style={{ color: PRIMARY_BLUE }} />
            </div>
            <p className="text-gray-700 font-semibold mb-1 text-base">
              Drag & drop your PDF file here
            </p>
            <button
              type="button"
              className="text-sm font-bold px-4 py-2 mt-2 cursor-pointer rounded-xl bg-white text-blue-900 border border-blue-900 hover:bg-blue-50 transition"
              onClick={openFileDialog}
            >
              Choose File
            </button>
            <small className="mt-3 text-gray-500 block">
              PDF only • Max 5MB
            </small>
          </div>
        </div>
        {/* Uploaded File Info */}
        {file && (
          <div className="mt-6">
            <div
              className="flex items-center justify-between p-4 bg-blue-50 rounded-xl shadow"
              style={{ borderLeft: `6px solid ${PRIMARY_BLUE}` }}
            >
              <div className="flex items-center gap-3">
                <StateIcon state={status} />
                <div>
                  <p className="font-medium text-blue-900 text-base">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-gray-200 rounded-full transition cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {status === "error" && (
              <div className="mt-2 p-3 bg-red-50 rounded-xl shadow">
                <p className="text-red-800 text-sm">{errorMessage}</p>
              </div>
            )}
          </div>
        )}
        {/* Button Group */}
        <div className="mt-8 flex flex-col gap-4 w-full">
          <button
            onClick={handleAnalyze}
            disabled={!file || status === "uploading"}
            className="w-full font-bold py-3 rounded-xl text-lg transition flex items-center justify-center gap-2"
            style={{
              background: PRIMARY_BLUE,
              color: "#FFFFFF",
              opacity: !file || status === "uploading" ? 0.6 : 1,
              cursor: !file || status === "uploading" ? "not-allowed" : "pointer",
            }}
          >
            {status === "uploading" && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
            )}
            {status === "uploading" ? "Analyzing..." : "Analyze Now"}
          </button>
          <Link href="/register" className="w-full">
            <button
              className="w-full font-bold py-3 rounded-xl text-lg flex items-center justify-center gap-2 transition shadow"
              style={{
                background: "#FFF8E5",
                color: "#AA8600",
                border: `2px solid ${PREMIUM_GOLD}`,
              }}
            >
              <StarIcon className="h-6 w-6" style={{ color: PREMIUM_GOLD }} />
              Get Premium Plan
            </button>
          </Link>
        </div>
      </div>
      {/* Legal & Privacy Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDisclaimer(false)} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: PRIMARY_BLUE }}>
                Legal & Privacy Disclaimer
              </h3>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="text-sm text-gray-800 space-y-5">
              <div>
                <h4 className="font-bold" style={{ color: PRIMARY_BLUE }}>Privacy</h4>
                <p>Your resume is only stored for analysis and deleted within 24 hours. No sharing, no selling. We value your privacy.</p>
              </div>
              <div>
                <h4 className="font-bold" style={{ color: PRIMARY_BLUE }}>Legal Results</h4>
                <p>Results are AI suggestions and may not be entirely accurate. Use them wisely; they don't guarantee employment or admissions.</p>
              </div>
              <div>
                <h4 className="font-bold" style={{ color: PRIMARY_BLUE }}>Accepted Format</h4>
                <p>Only PDF resumes up to 5MB. Make sure you upload the correct format.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDisclaimer(false)}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-lg font-medium cursor-pointer"
                style={{ background: PRIMARY_BLUE }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Result Modal */}
      {showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowResult(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: PRIMARY_BLUE }}>Analysis Results</h2>
              <button
                onClick={() => setShowResult(false)}
                className="p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {status === "error" && (
              <div className="bg-red-50 rounded-xl shadow p-3 mb-4">
                <p className="text-red-800">{errorMessage || "An error occurred during analysis."}</p>
              </div>
            )}
            {status === "success" && result && (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-xl">
                  <h3 className="font-bold text-green-900 mb-1">Overall Score</h3>
                  <span className="text-green-800 text-lg">{result.overallScore}</span>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-bold text-blue-900 mb-2">Summary</h3>
                  <p className="text-blue-800 leading-relaxed">{result.summary}</p>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowResult(false)}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-gray-800 rounded-lg font-bold"
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