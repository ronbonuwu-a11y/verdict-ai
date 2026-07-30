import Link from "next/link";
import { SponsoredBadge } from "@/components/SponsoredBadge";
import { VerdictBadge } from "@/components/VerdictBadge";
import type { Review } from "@/types/review";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Link
      href={`/reviews/${review.slug}`}
      className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-600 hover:bg-zinc-900"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            {review.category}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white group-hover:text-red-400">
            {review.toolName}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <VerdictBadge verdict={review.verdict} score={review.score} size="sm" />
          {review.isSponsored && (
            <SponsoredBadge label={review.sponsorLabel} />
          )}
        </div>
      </div>

      <p className="mb-3 text-sm italic text-zinc-400">
        &ldquo;{review.claim}&rdquo;
      </p>
      <p className="mb-4 flex-1 text-sm text-zinc-300">{review.summary}</p>

      <div className="flex items-center justify-between">
        <p className="text-xs text-zinc-500">
          Tested{" "}
          {new Date(review.testedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        {review.affiliateUrl && review.verdict === "APPROVED" && (
          <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-600">
            Affiliate
          </span>
        )}
      </div>
    </Link>
  );
}
