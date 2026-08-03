import { HomeReviewExplorer } from "@/components/HomeReviewExplorer";
import { getAllReviews, getCategories } from "@/lib/reviews";

export default function DatabasePage() {
  const reviews = getAllReviews();
  return <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20"><header className="mb-12 max-w-3xl sm:mb-16"><p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">The review database</p><h1 className="mt-4 text-5xl font-bold tracking-[-0.05em] text-slate-900 sm:text-6xl lg:text-7xl">The evidence behind the verdict.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">Search independent reviews, compare the claims, and see what actually held up when we put AI tools to work.</p></header><HomeReviewExplorer reviews={reviews} categories={getCategories()} approvedCount={reviews.filter((review) => review.verdict === "APPROVED").length} slopCount={reviews.filter((review) => review.verdict === "SLOP").length} /></main>;
}
