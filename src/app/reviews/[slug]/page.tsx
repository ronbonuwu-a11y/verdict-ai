import { VerdictBadge } from "@/components/VerdictBadge";
import { ReviewComments } from "@/components/ReviewComments";
import { getCurrentUser } from "@/lib/auth";
import { getAllReviews, getCommentsForReview, getReviewBySlug } from "@/lib/reviews";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ReviewPageProps { params: Promise<{ slug: string }>; }

function whyItMatters(result: string) {
  const text = result.toLowerCase();
  if (text.includes("artifact") || text.includes("warped") || text.includes("unreadable")) return "This can make customer-facing work unusable without manual cleanup.";
  if (text.includes("generic") || text.includes("robotic") || text.includes("reused")) return "It may save a first draft, but it still needs editing to sound specific.";
  if (text.includes("missed") || text.includes("ignored") || text.includes("failed") || text.includes("confused")) return "Treat this as a reliability limit and check the output before relying on it.";
  if (text.includes("worked") || text.includes("clear") || text.includes("correct") || text.includes("never")) return "This is evidence the tool handled this part of the job under the stated conditions.";
  return "Observed in the stated test conditions; use the methodology to judge how it applies to your work.";
}

export async function generateStaticParams() { return getAllReviews().map((review) => ({ slug: review.slug })); }
export async function generateMetadata({ params }: ReviewPageProps): Promise<Metadata> { const { slug } = await params; const review = getReviewBySlug(slug); return review ? { title: `${review.toolName} — ${review.verdict}`, description: review.summary } : { title: "Review not found" }; }

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const review = getReviewBySlug(slug);
  if (!review) notFound();
  const [comments, user] = await Promise.all([getCommentsForReview(review.slug), getCurrentUser()]);
  const testedDate = new Date(review.testedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return <article className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
    <Link href="/database" className="mb-10 inline-flex rounded-full border border-slate-400/60 bg-white/55 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white">← Back to database</Link>
    <header className="grid gap-8 rounded-3xl border border-slate-400/70 bg-white/75 p-7 shadow-xl shadow-slate-900/5 sm:p-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
      <div><p className="text-sm font-bold uppercase tracking-[.18em] text-red-600">{review.category}</p><h1 className="mt-4 text-5xl font-bold tracking-[-.05em] text-slate-900 sm:text-6xl">{review.toolName}</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">{review.summary}</p></div>
      <div className="lg:text-right"><VerdictBadge verdict={review.verdict} score={review.score} size="lg" /><p className="mt-4 text-sm text-slate-500">Tested {testedDate}</p></div>
    </header>

    <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      <section className="rounded-3xl border border-slate-400/70 bg-white/75 p-7"><p className="text-sm font-bold uppercase tracking-[.18em] text-red-600">The promise</p><p className="mt-4 text-xl leading-relaxed text-slate-800">“{review.claim}”</p><div className="mt-7 border-t border-slate-300 pt-6"><h2 className="text-xl font-bold text-slate-900">How we tested it</h2><p className="mt-3 leading-relaxed text-slate-600">{review.methodology}</p></div></section>
      <aside className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1"><section className="rounded-3xl border border-slate-400/70 bg-white/75 p-7"><p className="text-sm font-bold uppercase tracking-[.18em] text-red-600">Pricing</p><p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">{review.pricing.label}</p><p className="mt-3 text-sm leading-relaxed text-slate-600">{review.pricing.details}</p></section><section className="rounded-3xl border border-slate-400/70 bg-white/75 p-7"><p className="text-sm font-bold uppercase tracking-[.18em] text-red-600">Alternatives</p><ul className="mt-4 flex flex-wrap gap-2">{review.alternatives.map((alternative) => <li key={alternative} className="rounded-full border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">{alternative}</li>)}</ul></section></aside>
    </div>

    <section className="mt-10 rounded-3xl border border-slate-400/70 bg-white/75 p-7 sm:p-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-red-600">Test results</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">What actually happened</h2></div><p className="max-w-md text-sm leading-relaxed text-slate-500">Each finding includes the practical consequence, not only the technical observation.</p></div><ol className="mt-8 grid gap-4 md:grid-cols-2">{review.results.map((result, index) => <li key={result} className="rounded-2xl border border-slate-300 bg-white/70 p-5"><span className="text-xs font-bold tracking-[.16em] text-red-600">0{index + 1}</span><p className="mt-3 font-semibold text-slate-900">{result}</p><p className="mt-2 text-sm leading-relaxed text-slate-600">{whyItMatters(result)}</p></li>)}</ol></section>

    {review.extendedBreakdown && <section className="mt-10 rounded-3xl border border-slate-400/70 bg-white/75 p-7 sm:p-10"><p className="text-sm font-bold uppercase tracking-[.18em] text-red-600">{review.reviewStage ? "Research notes" : "The longer take"}</p><p className="mt-4 max-w-4xl leading-relaxed text-slate-700">{review.extendedBreakdown}</p></section>}
    {review.researchSources && review.researchSources.length > 0 && <section className="mt-10"><h2 className="text-2xl font-bold text-slate-900">Research sources</h2><ul className="mt-4 flex flex-wrap gap-3">{review.researchSources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full border border-slate-400/70 bg-white/65 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">{source.label} →</a></li>)}</ul></section>}
    <div className="mt-10"><ReviewComments slug={review.slug} initialComments={comments} canComment={Boolean(user)} /></div>
    <p className="mt-10 rounded-3xl border border-slate-400/70 bg-white/70 p-6 text-sm leading-relaxed text-slate-600">Think this rating misses important evidence? <Link href="/rerate" className="font-semibold text-slate-900 underline decoration-red-500 underline-offset-4">Request a re-rate</Link> with product updates, test access, and verifiable supporting material.</p>
  </article>;
}
