"use client";

import { useState } from "react";
import type { Nomination } from "@/types/review";

interface NominationQueueProps {
  initialNominations: Nomination[];
}

export function NominationQueue({ initialNominations }: NominationQueueProps) {
  const [nominations, setNominations] = useState(initialNominations);
  const [votingId, setVotingId] = useState<string | null>(null);

  async function handleUpvote(id: string) {
    setVotingId(id);
    try {
      const res = await fetch("/api/nominations/upvote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (res.ok) {
        setNominations((prev) =>
          prev
            .map((n) => (n.id === id ? { ...n, upvotes: data.upvotes } : n))
            .sort(
              (a, b) =>
                b.upvotes - a.upvotes ||
                b.submittedAt.localeCompare(a.submittedAt),
            ),
        );
      }
    } finally {
      setVotingId(null);
    }
  }

  if (nominations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700 p-12 text-center">
        <p className="text-zinc-400">
          No nominations yet. Be the first to suggest a tool.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {nominations.map((nomination, index) => (
        <div
          key={nomination.id}
          className="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
        >
          <span className="mt-1 font-mono text-sm text-zinc-600">
            #{index + 1}
          </span>
          <div className="flex-1">
            <h3 className="font-semibold text-white">{nomination.toolName}</h3>
            {nomination.toolUrl && (
              <a
                href={nomination.toolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                {nomination.toolUrl}
              </a>
            )}
            <p className="mt-2 text-sm text-zinc-400">{nomination.reason}</p>
            <p className="mt-2 text-xs text-zinc-600">
              Nominated{" "}
              {new Date(nomination.submittedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleUpvote(nomination.id)}
            disabled={votingId === nomination.id}
            className="flex flex-col items-center rounded-lg border border-zinc-700 px-3 py-2 transition hover:border-zinc-500 hover:bg-zinc-800 disabled:opacity-50"
          >
            <span className="text-lg font-bold text-white">
              {nomination.upvotes}
            </span>
            <span className="text-[10px] uppercase tracking-wide text-zinc-500">
              {votingId === nomination.id ? "..." : "Upvote"}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
