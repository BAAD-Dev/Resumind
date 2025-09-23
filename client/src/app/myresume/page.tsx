"use client";

import PremiumModal from "@/components/myResume/Notification";
import { FileText, BarChart, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Features() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("order_id") ?? "";
  const statusCode = searchParams.get("status_code") ?? "";
  const trxStatus = searchParams.get("transaction_status") ?? "";

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (orderId && trxStatus === "settlement" && statusCode === "200") {
      setOpen(true);

      const url = new URL(window.location.href);
      url.searchParams.delete("order_id");
      url.searchParams.delete("status_code");
      url.searchParams.delete("transaction_status");
      const cleaned =
        url.pathname +
        (url.searchParams.toString() ? `?${url.searchParams.toString()}` : "");
      router.replace(cleaned, { scroll: false });
    }
  }, [orderId, trxStatus, statusCode, router]);
  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#162B60] mb-12">
          Your Resume Journey
        </h2>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Upload & Save CV */}
          <div className="bg-[#162B60] rounded-2xl shadow-lg p-8 hover:scale-[1.03] transition">
            <Upload className="w-12 h-12 text-yellow-400 mb-4 mx-auto" />
            <h3 className="text-white text-xl font-semibold mb-3">
              Upload & Save CV
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              Store your CV securely and let AI keep track of{" "}
              <span className="text-yellow-400">multiple versions</span>.
            </p>
            <ul className="text-white space-y-2 list-disc list-inside text-left mt-6">
              <li>Upload and manage CV history</li>
              <li>AI feedback on every update</li>
              <li>Save versions for different jobs</li>
            </ul>
          </div>

          {/* CV Analyzer */}
          <div className="bg-[#162B60] rounded-2xl shadow-lg p-8 hover:scale-[1.03] transition">
            <FileText className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
            <h3 className="text-white text-xl font-semibold mb-3">
              CV Analyzer
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              AI refines your CV into an{" "}
              <span className="text-blue-400">ATS-friendly</span> format.
            </p>
            <ul className="text-white space-y-2 list-disc list-inside text-left mt-6">
              <li>Overall CV Score</li>
              <li>Auto-generated keywords</li>
              <li>Section breakdown detail</li>
            </ul>
          </div>

          {/* Job Match */}
          <div className="bg-[#162B60] rounded-2xl shadow-lg p-8 hover:scale-[1.03] transition">
            <BarChart className="w-12 h-12 text-green-400 mb-4 mx-auto" />
            <h3 className="text-white text-xl font-semibold mb-3">
              Job Matcher
            </h3>
            <p className="text-gray-300 mb-4 text-sm">
              Paste a job description link and get your{" "}
              <span className="text-green-400">match score</span>.
            </p>
            <ul className="text-white space-y-2 list-disc list-inside text-left mt-6">
              <li>AI-powered match percentage</li>
              <li>Improvement suggestions</li>
              <li>Suggested edits on CV</li>
            </ul>
          </div>
        </div>
      </div>
      <PremiumModal
        open={open}
        onClose={() => setOpen(false)}
        message="User can now access premium feature"
      />
    </section>
  );
}
