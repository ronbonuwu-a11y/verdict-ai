"use client";

import { useMemo, useState, type RefObject } from "react";
import { ReviewCard } from "@/components/ReviewCard";
import type { Review } from "@/types/review";

interface ReviewSearchProps {
  reviews: Review[];
  categories: string[];
  query?: string;
  onQueryChange?: (query: string) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
}

export function ReviewSearch({ reviews, categories, query: controlledQuery, onQueryChange, inputRef }: ReviewSearchProps) {
  const [internalQuery, setInternalQuery] = useState("");
  const [category, setCategory] = useState("");
  const [verdict, setVerdict] = useState("");
  const [sort, setSort] = useState("relevance");
  const query = controlledQuery ?? internalQuery;

  function setQuery(nextQuery: string) {
    setInternalQuery(nextQuery);
    onQueryChange?.(nextQuery);
  }

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    const matches = reviews.filter((review) => {
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

    return sort === "price-asc"
      ? [...matches].sort((a, b) => (a.pricing.startingMonthly ?? Number.POSITIVE_INFINITY) - (b.pricing.startingMonthly ?? Number.POSITIVE_INFINITY))
      : matches;
  }, [reviews, query, category, verdict, sort]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          ref={inputRef}
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
          <option value="APPROVED">Approved</option>
          <option value="SLOP">Slop</option>
          <option value="FLAWED">Flawed</option>
          <option value="PASSABLE">Passable</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort reviews"
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          <option value="relevance">Sort: relevance</option>
          <option value="price-asc">Price: low to high</option>
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
