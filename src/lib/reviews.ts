import { readFileSync } from "fs";
import { promises as fs } from "fs";
import path from "path";
import { categoryToSlug } from "@/lib/categories";
import type {
  AgencyInquiry,
  AgencyService,
  EmailSubscriber,
  NewsletterIssue,
  Nomination,
  Review,
  Verdict,
} from "@/types/review";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const NOMINATIONS_FILE = path.join(DATA_DIR, "nominations.json");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");
const NEWSLETTER_FILE = path.join(DATA_DIR, "newsletter-issues.json");
const AGENCY_FILE = path.join(DATA_DIR, "agency-inquiries.json");

const RESEARCH_BRIEF_SCORES: Record<string, number> = {
  "research-jasper": 6.0,
  "research-copy-ai": 5.8,
  "research-writer": 6.8,
  "research-grammarly": 6.0,
  "research-quillbot": 6.3,
  "research-surfer": 5.7,
  "research-clearscope": 6.5,
};

function readJsonSync<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(filePath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

async function readJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getAllReviews(): Review[] {
  const reviews = readJsonSync<Array<Omit<Review, "verdict" | "score"> & { verdict: string; score?: number }>>(REVIEWS_FILE, []);
  return reviews.map((review) => ({
    ...review,
    verdict: review.verdict === "BARELY PASSES" ? "QUALIFIED PASS" : review.verdict as Verdict,
    score: Number.isFinite(review.score) ? review.score! : RESEARCH_BRIEF_SCORES[review.id] ?? 5.0,
  }));
}

export function getReviewBySlug(slug: string): Review | undefined {
  return getAllReviews().find((review) => review.slug === slug);
}

export function getReviewsByCategory(category: string): Review[] {
  return getAllReviews().filter((review) => review.category === category);
}

export function getReviewsByVerdict(verdict: Verdict): Review[] {
  return getAllReviews().filter((review) => review.verdict === verdict);
}

export function getActuallyGoodReviews(): Review[] {
  return getAllReviews().filter((review) => review.verdict === "PASSES");
}

export function getFeaturedNewsletterReviews(): Review[] {
  return getAllReviews().filter((review) => review.featuredInNewsletter);
}

export function searchReviews(query: string, category?: string): Review[] {
  const normalized = query.trim().toLowerCase();

  return getAllReviews().filter((review) => {
    const matchesCategory = !category || review.category === category;
    if (!normalized) return matchesCategory;

    const haystack = [
      review.toolName,
      review.category,
      review.claim,
      review.summary,
      review.verdict,
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && haystack.includes(normalized);
  });
}

export function getCategories(): string[] {
  return [...new Set(getAllReviews().map((review) => review.category))].sort();
}

export function getCategorySlugs(): { slug: string; name: string; count: number }[] {
  const reviews = getAllReviews();
  const categories = getCategories();

  return categories.map((name) => ({
    slug: categoryToSlug(name),
    name,
    count: reviews.filter((r) => r.category === name).length,
  }));
}

export function getReviewStats() {
  const reviews = getAllReviews();
  return {
    total: reviews.length,
    passes: reviews.filter((r) => r.verdict === "PASSES").length,
    fails: reviews.filter((r) => r.verdict === "FAILS").length,
    mixed: reviews.filter((r) => r.verdict === "MIXED").length,
    qualifiedPasses: reviews.filter((r) => r.verdict === "QUALIFIED PASS").length,
  };
}

export async function getAllNominations(): Promise<Nomination[]> {
  const nominations = await readJsonFile<Nomination>(NOMINATIONS_FILE);
  return nominations
    .map((n) => ({ ...n, upvotes: n.upvotes ?? 0 }))
    .sort((a, b) => b.upvotes - a.upvotes || b.submittedAt.localeCompare(a.submittedAt));
}

export async function addNomination(
  nomination: Omit<Nomination, "id" | "submittedAt" | "upvotes">,
): Promise<Nomination> {
  const nominations = await readJsonFile<Nomination>(NOMINATIONS_FILE);
  const entry: Nomination = {
    ...nomination,
    id: crypto.randomUUID(),
    upvotes: 0,
    submittedAt: new Date().toISOString(),
  };

  nominations.push(entry);
  await writeJsonFile(NOMINATIONS_FILE, nominations);
  return entry;
}

export async function upvoteNomination(id: string): Promise<Nomination | null> {
  const nominations = await readJsonFile<Nomination>(NOMINATIONS_FILE);
  const index = nominations.findIndex((n) => n.id === id);
  if (index === -1) return null;

  nominations[index] = {
    ...nominations[index],
    upvotes: (nominations[index].upvotes ?? 0) + 1,
  };

  await writeJsonFile(NOMINATIONS_FILE, nominations);
  return nominations[index];
}

export async function addSubscriber(email: string): Promise<EmailSubscriber> {
  const subscribers = await readJsonFile<EmailSubscriber>(SUBSCRIBERS_FILE);
  const normalized = email.trim().toLowerCase();

  const existing = subscribers.find((s) => s.email === normalized);
  if (existing) return existing;

  const entry: EmailSubscriber = {
    id: crypto.randomUUID(),
    email: normalized,
    subscribedAt: new Date().toISOString(),
  };

  subscribers.push(entry);
  await writeJsonFile(SUBSCRIBERS_FILE, subscribers);
  return entry;
}

export function getNewsletterIssues(): NewsletterIssue[] {
  return readJsonSync<NewsletterIssue[]>(NEWSLETTER_FILE, []).sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

export async function addAgencyInquiry(
  inquiry: Omit<AgencyInquiry, "id" | "submittedAt">,
): Promise<AgencyInquiry> {
  const inquiries = await readJsonFile<AgencyInquiry>(AGENCY_FILE);
  const entry: AgencyInquiry = {
    ...inquiry,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };

  inquiries.push(entry);
  await writeJsonFile(AGENCY_FILE, inquiries);
  return entry;
}

export async function saveReview(review: Review): Promise<Review> {
  const reviews = getAllReviews();
  const index = reviews.findIndex((r) => r.id === review.id);

  if (index >= 0) {
    reviews[index] = review;
  } else {
    reviews.push(review);
  }

  await writeJsonFile(REVIEWS_FILE, reviews);
  return review;
}

export async function deleteReview(id: string): Promise<boolean> {
  const reviews = getAllReviews();
  const filtered = reviews.filter((r) => r.id !== id);
  if (filtered.length === reviews.length) return false;

  await writeJsonFile(REVIEWS_FILE, filtered);
  return true;
}

export function createReviewPayload(
  input: Omit<Review, "id" | "slug"> & { slug?: string },
): Review {
  const id = crypto.randomUUID();
  const slug =
    input.slug ??
    input.toolName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return { ...input, id, slug };
}

export type { AgencyService };
