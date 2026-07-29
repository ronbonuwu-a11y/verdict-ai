import { VerdictBadge } from "@/components/VerdictBadge";
import { getAllReviews, getReviewBySlug } from "@/lib/reviews";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface ReviewPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllReviews().map((review) => ({ slug: review.slug }));
}

export async function generateMetadata({
  params,
}: ReviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const review = getReviewBySlug(slug);

  if (!review) return { title: "Review not found" };

  return {
    title: `${review.toolName} — ${review.verdict}`,
    description: review.summary,
  };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug } = await params;
  const review = getReviewBySlug(slug);

  if (!review) notFound();

  const testedDate = new Date(review.testedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link
        href="/"
        className="mb-8 inline-flex text-sm text-zinc-500 transition hover:text-white"
      >
        ← Back to verdicts
      </Link>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          {review.category}
        </p>
        <span className="text-zinc-700">·</span>
        <p className="text-sm text-zinc-500">Tested {testedDate}</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          {review.toolName}
        </h1>
        <VerdictBadge verdict={review.verdict} score={review.score} size="lg" />
      </div>

      <section className="mb-10 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          The claim
        </h2>
        <p className="text-lg italic text-zinc-200">
          &ldquo;{review.claim}&rdquo;
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold text-white">Verdict</h2>
        <p className="text-lg leading-relaxed text-zinc-300">{review.summary}</p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold text-white">How we tested it</h2>
        <p className="leading-relaxed text-zinc-300">{review.methodology}</p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-white">Results</h2>
        <ul className="space-y-3">
          {review.results.map((result, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-zinc-300"
            >
              <span className="mt-0.5 font-mono text-xs text-zinc-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              {result}
            </li>
          ))}
        </ul>
      </section>

      {review.extendedBreakdown && (
        <section className="mb-10 rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <h2 className="mb-3 text-xl font-bold text-white">{review.reviewStage ? "Research notes" : "Extended breakdown"}</h2>
          <p className="leading-relaxed text-zinc-300">{review.extendedBreakdown}</p>
        </section>
      )}

      {review.researchSources && review.researchSources.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-xl font-bold text-white">Research sources</h2>
          <ul className="space-y-2">
            {review.researchSources.map((source) => (
              <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-zinc-300 underline decoration-red-500 underline-offset-4 transition hover:text-white">{source.label} →</a></li>
            ))}
          </ul>
        </section>
      )}

      {review.instagramUrl && (
        <a
          href={review.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
        >
          Watch the Reel →
        </a>
      )}
    </article>
  );
}
