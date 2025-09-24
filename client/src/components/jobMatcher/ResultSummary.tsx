import { formatDate } from "@/lib/format";

type AnalysisResult = {
  overallScore: number;
  summary: string;
  actionableNextSteps?: string[];
};

type ResultSummaryProps = {
  result: AnalysisResult;
  when: string;
};

export default function ResultSummary({ result, when }: ResultSummaryProps) {
  const score: number | null =
    typeof result?.overallScore === "number"
      ? Math.max(0, Math.min(100, result.overallScore))
      : null;

  const getScoreColor = (s: number) =>
    s > 75 ? "text-emerald-600" : s > 50 ? "text-yellow-500" : "text-red-500";

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {score !== null && (
          <div className="w-11 h-11 relative flex items-center justify-center mr-1">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <circle
                className="text-gray-200"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                cx="18"
                cy="18"
                r="16"
              />
              <circle
                className={getScoreColor(score)}
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                cx="18"
                cy="18"
                r="16"
                strokeDasharray={`${score * 1.01}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-sm font-bold text-[#162B60]">{score}</span>
          </div>
        )}
        <div className="text-xs text-gray-400 mt-1">
          {`Generated at ${formatDate(when)}`}
        </div>
      </div>
      {result?.summary && (
        <div className="mb-2 mt-3">
          <div className="font-semibold text-[#162B60] text-[15px] mb-1">Summary</div>
          <p className="text-sm text-gray-700">{result.summary}</p>
        </div>
      )}
      {!!result?.actionableNextSteps?.length && (
        <div className="mt-2">
          <div className="font-semibold text-[#162B60] text-[15px] mb-1">Actionable Next Steps</div>
          <ul className="space-y-1 pl-4 list-disc text-sm text-gray-700">
            {result.actionableNextSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
