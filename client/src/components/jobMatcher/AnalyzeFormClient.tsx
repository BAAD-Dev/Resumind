"use client";

import { useState, useTransition } from "react";
import { toast } from "react-toastify";
import { analyzeJobMatchAction } from "@/app/myresume/job-matcher/action";
import { formatDate } from "@/lib/format";
import { CVItem, JobItem } from "@/app/myresume/job-matcher/data";
import ModalLoader from "./ModalLoader";

// type CV = { id: string; originalName: string; createdAt: string };
// type Job = { id: string; title: string; company?: string; createdAt: string };

export default function AnalyzeFormClient({
  cvs,
  jobs,
  selectedCvId,
}: {
  cvs: CVItem[];
  jobs: JobItem[];
  selectedCvId: string;
}) {
  // const router = useRouter();
  const [pending] = useTransition();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      setLoading(true);
      await analyzeJobMatchAction(fd);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to fetch job");
      } 
    }finally {
    setLoading(false);
  }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {loading && <ModalLoader />}
      {/* Select file */}
      <div>
        <label className="block text-sm font-medium mb-1">Select file</label>
        <select
          name="cvId"
          defaultValue={selectedCvId}
          className="w-full border rounded-md p-2"
          required>
          {!selectedCvId && <option value="">— Choose your file —</option>}
          {cvs.map((cv) => (
            <option key={cv.id} value={cv.id}>
              {cv.originalName} · {formatDate(cv.createdAt)}
            </option>
          ))}
        </select>
      </div>

      {/* Choose existing Job OR paste a new one */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Existing Job */}
        <div className="rounded-xl border p-4">
          <div className="text-sm font-medium mb-2">Use a Saved Job</div>
          <select name="jobId" className="w-full border rounded-md p-2">
            <option value="">— Select a saved job —</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
                {job.company ? ` · ${job.company}` : ""} ·{" "}
                {formatDate(job.createdAt)}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            If you select a saved job, you can leave the “Paste job posting” box
            empty.
          </p>
        </div>

        {/* Paste new Job */}
        <div className="rounded-xl border p-4">
          <div className="text-sm font-medium mb-2">
            Or paste a new Job Posting
          </div>
          <textarea
            name="jobText"
            rows={6}
            placeholder="Paste the job description here…"
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              name="jobTitle"
              placeholder="Job Title (optional)"
              className="w-full border rounded-md p-2"
            />
            <input
              name="jobCompany"
              placeholder="Company (optional)"
              className="w-full border rounded-md p-2"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            We’ll save this as a new Job for future use.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition disabled:opacity-60">
        {pending ? "Evaluating…" : "Evaluate Job Posting"}
      </button>
    </form>
  );
}
