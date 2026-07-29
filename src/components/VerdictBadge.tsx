import type { Verdict } from "@/types/review";

const styles: Record<Verdict, string> = {
  PASSES: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
  FAILS: "bg-red-500/15 text-red-400 ring-red-500/30",
  MIXED: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
  "QUALIFIED PASS": "bg-orange-500/15 text-orange-400 ring-orange-500/30",
};

interface VerdictBadgeProps {
  verdict: Verdict;
  score?: number;
  size?: "sm" | "md" | "lg";
}

export function VerdictBadge({ verdict, score, size = "md" }: VerdictBadgeProps) {
  const sizeClass =
    size === "lg"
      ? "px-4 py-2 text-sm"
      : size === "sm"
        ? "px-2 py-0.5 text-[10px]"
        : "px-3 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider ring-1 ring-inset ${styles[verdict]} ${sizeClass}`}
    >
      {verdict}{score !== undefined && <span className="ml-1.5 border-l border-current/30 pl-1.5 tabular-nums">{score.toFixed(1)}/10</span>}
    </span>
  );
}
