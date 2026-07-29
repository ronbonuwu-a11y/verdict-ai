"use client";

import { useMemo, useState } from "react";
import { ReviewCard } from "@/components/ReviewCard";
import type { Review } from "@/types/review";

interface ReviewSearchProps {
  reviews: Review[];
  categories: string[];
}

export function ReviewSearch({ reviews, categories }: ReviewSearchProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [verdict, setVerdict] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return reviews.filter((review) => {
      const matchesCategory = !category || review.category === category;
      const matchesVerdict = !verdict || review.verdict === verdict;
      if (!normalized) return matchesCategory && matchesVerdict;

      const haystack = [
        review.toolName,
        review.category,
        review.claim,
        review.summary,
        review.verdict,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory && matchesVerdict && haystack.includes(normalized)
      );
    });
  }, [reviews, query, category, verdict]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          placeholder="Search tools, claims, or verdicts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={verdict}
          onChange={(e) => setVerdict(e.target.value)}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          <option value="">All verdicts</option>
          <option value="PASSES">Passes</option>
          <option value="FAILS">Fails</option>
          <option value="MIXED">Mixed</option>
          <option value="QUALIFIED PASS">Qualified Pass</option>
        </select>
      </div>

      <p className="mb-4 text-sm text-zinc-500">
        {filtered.length} verdict{filtered.length === 1 ? "" : "s"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 p-12 text-center">
          <p className="text-zinc-400">No verdicts match your search.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
