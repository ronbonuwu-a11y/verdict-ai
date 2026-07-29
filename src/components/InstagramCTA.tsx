import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function InstagramCTA() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-red-500">
          Follow the tests
        </p>
        <p className="mt-1 text-lg font-bold text-white">
          Watch verdicts on Instagram
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          New Reels every Mon, Wed, and Fri. {siteConfig.instagramHandle}
        </p>
      </div>
      <a
        href={siteConfig.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-purple-500 hover:to-pink-500"
      >
        Follow on Instagram
      </a>
    </div>
  );
}

export function InstagramCTACompact() {
  return (
    <Link
      href={siteConfig.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm text-zinc-400 transition hover:text-white"
    >
      {siteConfig.instagramHandle} on Instagram →
    </Link>
  );
}
