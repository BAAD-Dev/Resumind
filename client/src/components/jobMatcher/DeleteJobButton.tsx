"use client";

import { useTransition } from "react";
import { toast } from "react-toastify";
import { deleteJobAction } from "@/app/myresume/job-matcher/action";

export default function DeleteJobButton({
  jobId,
  currentCvId,
}: {
  jobId: string;
  currentCvId?: string;
}) {
  const [pending] = useTransition();

  async function onDelete() {
    try {
      await deleteJobAction(jobId, currentCvId);
    } catch (err: any) {
      toast.error(err?.message || "Gagal menghapus job");
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      className="text-sm rounded-md border px-3 py-1.5 hover:bg-slate-50 disabled:opacity-60">
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
