import { formatDate } from "@/lib/format";
import { History } from "lucide-react";
import Link from "next/link";

type AnalysisResult = {
  overallScore: number;
  summary: string;
  actionableNextSteps?: string[];
};

type Analysis = {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  cvId: string;
  result: AnalysisResult;
};

type JobMatchHistoryProps = {
  analyses: Analysis[];
};

export default function JobMatchHistory({ analyses }: JobMatchHistoryProps) {
  const items = (analyses ?? [])
    .filter((a) => a.type?.toUpperCase() === "JOB_MATCH_ANALYSIS")
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  const statusChip = (status: string) => {
    const isDone = status.toUpperCase() === "COMPLETED";
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${isDone ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700"}`}>
        {isDone ? "Completed" : "In Progress"}
      </span>
    );
  };

  return (
    <div className="rounded-2xl shadow bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-6 h-6 text-[#162B60]" />
        <h3 className="font-semibold text-[#162B60] text-lg tracking-tight">
          Analysis History
        </h3>
      </div>
      {!items.length ? (
        <div className="text-[15px] text-gray-400 text-center py-10">
          Your job match results will appear here.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((a) => (
            <li key={a.id} className="flex justify-between items-center rounded-md px-4 py-2 hover:bg-[#f6f8fd] transition">
              <div>
                <div className="flex items-center gap-2">
                  {statusChip(a.status)}
                  {typeof a.result?.overallScore === "number" && (
                    <span className="ml-2 text-xs font-semibold text-[#162B60]">
                      Score: {Math.round(a.result.overallScore)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400">{formatDate(a.createdAt)} · ID: {a.id.slice(0, 6)}…</div>
              </div>
              <Link href={`/myresume/job-matcher/${a.cvId}`} className="text-xs font-semibold text-[#162B60]">
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
