import { EmailSignup } from "@/components/EmailSignup";
import { ReviewSearch } from "@/components/ReviewSearch";
import { VerdictBadge } from "@/components/VerdictBadge";
import { SignalConsole } from "@/components/SignalConsole";
import { ScrollFieldGuide } from "@/components/ScrollFieldGuide";
import { getAllReviews, getCategories } from "@/lib/reviews";
import Link from "next/link";

export default function HomePage() {
  const reviews = getAllReviews();
  const categories = getCategories();

  const passCount = reviews.filter((r) => r.verdict === "PASSES").length;
  const failCount = reviews.filter((r) => r.verdict === "FAILS").length;
  const actuallyGood = reviews.filter((r) => r.verdict === "PASSES").slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <a href="#database" className="fixed bottom-5 right-5 z-20 rounded-full bg-white px-4 py-3 text-sm font-bold text-zinc-950 shadow-xl transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hover:scale-100">Jump to verdicts ↓</a>
      <SignalConsole total={reviews.length} />

      <section className="mb-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">At a glance</p>
        <div className="flex flex-wrap gap-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-5 py-3">
            <p className="text-2xl font-bold text-white">{reviews.length}</p>
            <p className="text-xs text-zinc-500">Tools tested</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-5 py-3">
            <p className="text-2xl font-bold text-emerald-400">{passCount}</p>
            <p className="text-xs text-zinc-500">Pass</p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-5 py-3">
            <p className="text-2xl font-bold text-red-400">{failCount}</p>
            <p className="text-xs text-zinc-500">Fail</p>
          </div>
        </div>
      </section>

      <section id="database" className="mb-16 scroll-mt-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-base font-black uppercase tracking-[0.16em] text-red-400">The database</p>
            <h2 className="mt-1 text-2xl font-bold text-white">Every claim gets receipts.</h2>
          </div>
          <Link href="/editorial-policy" className="text-sm font-medium text-zinc-400 transition hover:text-white">Our independence promise →</Link>
        </div>
        <ReviewSearch reviews={reviews} categories={categories} />
      </section>

      <section className="mb-16 grid gap-5 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <p className="text-base font-black uppercase tracking-[0.16em] text-emerald-400">Actually good</p>
          <h2 className="mt-2 text-2xl font-bold text-white">The tools we&apos;d use again.</h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">We don&apos;t review to dunk. A pass means the product delivered in our real-world test.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {actuallyGood.map((review) => (
            <Link key={review.id} href={`/reviews/${review.slug}`} className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 transition hover:border-emerald-500/50 hover:bg-zinc-900">
              <VerdictBadge verdict={review.verdict} score={review.score} size="sm" />
              <h3 className="mt-4 font-semibold text-white">{review.toolName}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{review.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <EmailSignup />
      <ScrollFieldGuide />
    </div>
  );
}
