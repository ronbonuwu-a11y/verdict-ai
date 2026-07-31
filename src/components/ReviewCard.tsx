"use client";

import Link from "next/link";
import { SponsoredBadge } from "@/components/SponsoredBadge";
import { VerdictBadge } from "@/components/VerdictBadge";
import type { Review } from "@/types/review";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  function updateSpotlight(event: React.PointerEvent<HTMLAnchorElement>) {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    card.style.setProperty("--spotlight-x", `${event.clientX - bounds.left}px`);
    card.style.setProperty("--spotlight-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <Link
      href={`/reviews/${review.slug}`}
      onPointerMove={updateSpotlight}
      data-verdict={review.verdict}
      className="review-spotlight group flex min-h-[250px] flex-col rounded-3xl border-2 bg-zinc-900/50 p-6 transition duration-200 hover:-translate-y-1 hover:bg-zinc-900"
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
