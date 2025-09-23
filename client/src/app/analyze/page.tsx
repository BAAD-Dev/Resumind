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
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
      });
      return;
    }
    if (pdfFiles.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Only PDF files are permitted.",
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
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
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
      });
      return;
    }
    if (file.type !== "application/pdf") {
      Swal.fire({
        icon: "error",
        title: "Only PDF files are allowed.",
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
      });
      setStatus("error");
      setErrorMessage("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Maximum file size is 5MB.",
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
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
        {
          method: "POST",
          body: fd,
        }
      );

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        Swal.fire({
          icon: "error",
          title: text || `Upload failed (${res.status})`,
          showClass: {
            popup: "animate__animated animate__fadeInUp animate__faster",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutDown animate__faster",
          },
        });
        throw new Error(text || `Upload failed (${res.status})`);
      }
      const data = (await res.json()) as AnalyzeResponse;
      setResult(data);
      setStatus("success");
      setShowResult(true);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: err?.message || "An error occurred during upload/analysis.",
        showClass: {
          popup: "animate__animated animate__fadeInUp animate__faster",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutDown animate__faster",
        },
      });
      setStatus("error");
      setErrorMessage(
        err?.message || "An error occurred during upload/analysis."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans px-2 sm:px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl p-2 sm:p-4">
        {/* Header */}
        <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl p-2 sm:p-4">
          {/* Back Button - absolute top left */}
          <Link href="/" className="absolute top-4 left-4 z-10">
            <button className="p-2 rounded hover:bg-gray-100 transition-colors flex items-center">
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
          </Link>

          <div className="mb-4 flex flex-col items-center justify-center">
            <Image
              src="/new.png"
              alt="resumind_logo"
              width={150}
              height={30}
              className="object-contain mb-1"
              priority
            />
            <p className="text-gray-700 mt-1 text-sm sm:text-base text-center">
              Get AI-powered insights and improve your resume for the right job!
            </p>
          </div>
        </div>

        {/* Blue Section */}
        <div
          style={{ background: PRIMARY_BLUE }}
          className="rounded-lg px-3 py-4 flex flex-col sm:flex-row items-center justify-between mb-3 gap-2"
        >
          <div className="flex items-center gap-2">
            <InformationCircleIcon className="h-5 w-5 text-white" />
            <h2 className="font-semibold text-white text-base sm:text-lg">
              Upload Your Resume or CV
            </h2>
          </div>
          <button
            onClick={() => setShowDisclaimer(true)}
            className="bg-white text-xs text-black rounded px-3 py-1 font-semibold cursor-pointer hover:bg-gray-100"
          >
            Learn more
          </button>
        </div>

        {/* Disclaimer Points */}
        <div
          className="mb-5 p-3 sm:p-4 border rounded-lg bg-blue-50"
          style={{ borderColor: PRIMARY_BLUE }}
        >
          <ul className="text-xs sm:text-sm text-blue-900 space-y-2">
            <li>• Resume or CVs are stored temporarily for analysis only</li>
            <li>• All files are deleted within 24 hours</li>
            <li>• Results are AI-generated, not 100% factual</li>
            <li>• Only PDF accepted, max 5MB</li>
          </ul>
        </div>

        {/* File Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-5 sm:p-8 text-center transition-all duration-200 ${
            isDragActive
              ? "border-blue-700 bg-blue-50"
              : "border-gray-300 hover:border-blue-700 hover:bg-gray-50"
          }`}
        >
          <input {...getInputProps({ refKey: "ref" })} ref={inputRef} />
          <div className="flex flex-col items-center">
            <div
              className="p-2 sm:p-3 bg-gray-100 rounded-full mb-4"
              style={{ border: `1px solid ${PRIMARY_BLUE}` }}
            >
              <ArrowUpTrayIcon
                className="h-8 w-8"
                style={{ color: PRIMARY_BLUE }}
              />
            </div>
            <p className="text-gray-700 font-medium mb-1 text-xs sm:text-base">
              Drag & drop your PDF file here
            </p>
            <button
              type="button"
              className="text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 cursor-pointer rounded-lg mt-2 border border-blue-900 bg-white text-blue-900 hover:bg-blue-50"
              onClick={openFileDialog}
            >
              Choose file
            </button>
            <p className="text-xs text-gray-500 mt-2">PDF only • Max 5MB</p>
          </div>
        </div>

        {/* Uploaded File Box */}
        {file && (
          <div className="mt-6">
            <div
              className="flex items-center justify-between p-2 sm:p-4 bg-gray-50 rounded-lg border"
              style={{ borderColor: PRIMARY_BLUE }}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <StateIcon state={status} />
                <div>
                  <p className="font-medium text-gray-900 text-xs sm:text-base">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {status === "error" && (
              <div className="mt-3 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-xs sm:text-sm">
                  {errorMessage}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Button Area */}
        <div className="mt-8 flex flex-col gap-3 w-full">
          <button
            onClick={handleAnalyze}
            disabled={!file || status === "uploading"}
            className="w-full font-bold py-3 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              background: PRIMARY_BLUE,
              color: "white",
              opacity: !file || status === "uploading" ? 0.6 : 1,
              cursor:
                !file || status === "uploading" ? "not-allowed" : "pointer",
            }}
          >
            {status === "uploading" && (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            )}
            {status === "uploading" ? "Analyzing..." : "Analyze Now"}
          </button>
          <Link href="/register" className="w-full">
            <button
              className="cursor-pointer w-full font-bold py-3 px-4 sm:px-6 rounded-lg text-base sm:text-lg flex items-center justify-center gap-2 border"
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
        </div>
      </div>

      {/* Modal for Disclaimer */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDisclaimer(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-4 sm:p-6 shadow-lg border border-blue-900">
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-base sm:text-lg font-bold"
                style={{ color: PRIMARY_BLUE }}
              >
                Legal & Privacy Disclaimer
              </h3>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="text-xs sm:text-sm text-gray-800 space-y-3 mb-2">
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
              <div>
                <h4 className="font-semibold" style={{ color: PRIMARY_BLUE }}>
                  Legal Notice
                </h4>
                <p>
                  This website provides analysis for information purposes only,
                  and does not guarantee employment, admissions, or accuracy.
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
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

      {/* Modal Results */}
      {showResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowResult(false)}
          />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-xl shadow-lg border border-blue-900 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-base sm:text-lg font-bold"
                style={{ color: PRIMARY_BLUE }}
              >
                Analysis Results
              </h2>
              <button
                onClick={() => setShowResult(false)}
                className="p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            {status === "error" && (
              <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-xs sm:text-sm">
                  {errorMessage || "An error occurred during analysis."}
                </p>
              </div>
            )}
            {status === "success" && result && (
              <div className="space-y-4">
                <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-1 text-xs sm:text-base">
                    Overall Score
                  </h3>
                  <p className="text-green-800 text-xs sm:text-base">
                    {result.overallScore}
                  </p>
                </div>
                <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold" style={{ color: PRIMARY_BLUE }}>
                    Summary
                  </h3>
                  <p className="text-blue-800 text-xs sm:text-base leading-relaxed">
                    {result.summary}
                  </p>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end cursor-pointer">
              <button
                onClick={() => setShowResult(false)}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-gray-800 rounded-lg font-medium"
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
