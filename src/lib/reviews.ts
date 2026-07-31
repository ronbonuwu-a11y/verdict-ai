import { readFileSync } from "fs";
import { promises as fs } from "fs";
import path from "path";
import { categoryToSlug } from "@/lib/categories";
import type {
  AgencyInquiry,
  AgencyService,
  Category,
  EmailSubscriber,
  NewsletterIssue,
  Nomination,
  ReviewComment,
  Review,
  RerateRequest,
  Verdict,
} from "@/types/review";

const DATA_DIR = path.join(process.cwd(), "src", "data");
const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");
const NOMINATIONS_FILE = path.join(DATA_DIR, "nominations.json");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");
const NEWSLETTER_FILE = path.join(DATA_DIR, "newsletter-issues.json");
const AGENCY_FILE = path.join(DATA_DIR, "agency-inquiries.json");
const COMMENTS_FILE = path.join(DATA_DIR, "comments.json");
const RERATE_FILE = path.join(DATA_DIR, "rerate-requests.json");

const RESEARCH_BRIEF_SCORES: Record<string, number> = {
  "research-jasper": 6.0,
  "research-copy-ai": 5.8,
  "research-writer": 6.8,
  "research-grammarly": 6.0,
  "research-quillbot": 6.3,
  "research-surfer": 5.7,
  "research-clearscope": 6.5,
};

const CATEGORY_BY_TOOL: Record<string, Category> = {
  "WriteSmart AI": "Writing & Research",
  PixelForge: "Image Generation & Editing",
  FocusFlow: "Productivity",
  ClipGenius: "Video Editing",
  "NoteWriter Pro": "Writing & Research",
  "BrandBot AI": "Marketing & GTM",
  Jasper: "Marketing & GTM",
  "Copy.ai": "Marketing & GTM",
  Writer: "Enterprise Automation",
  Grammarly: "Writing & Research",
  QuillBot: "Writing & Research",
  Surfer: "SEO & Discoverability",
  Clearscope: "SEO & Discoverability",
};

const MARKET_DETAILS: Record<string, Pick<Review, "pricing" | "alternatives">> = {
  "WriteSmart AI": { pricing: { startingMonthly: 12, label: "From $12/month", details: "Starter pricing shown for comparison; feature limits may apply." }, alternatives: ["Jasper", "Copy.ai", "Grammarly"] },
  PixelForge: { pricing: { startingMonthly: 20, label: "From $20/month", details: "Entry plan used for price comparison." }, alternatives: ["Adobe Firefly", "Canva Magic Studio", "PhotoRoom"] },
  FocusFlow: { pricing: { startingMonthly: 10, label: "From $10/month", details: "Individual plan used for price comparison." }, alternatives: ["Motion", "Reclaim", "Sunsama"] },
  ClipGenius: { pricing: { startingMonthly: 19, label: "From $19/month", details: "Entry plan used for price comparison." }, alternatives: ["OpusClip", "Descript", "Captions"] },
  "NoteWriter Pro": { pricing: { startingMonthly: 15, label: "From $15/month", details: "Individual plan used for price comparison." }, alternatives: ["Otter", "Fireflies", "Fathom"] },
  "BrandBot AI": { pricing: { startingMonthly: 39, label: "From $39/month", details: "Entry plan used for price comparison." }, alternatives: ["Jasper", "Copy.ai", "Hootsuite OwlyWriter"] },
  Jasper: { pricing: { startingMonthly: 69, label: "From $69/month per seat", details: "Pro monthly pricing; a 7-day trial is offered. Business pricing is custom." }, alternatives: ["Copy.ai", "Writer", "ChatGPT"] },
  "Copy.ai": { pricing: { startingMonthly: 29, label: "From $29/month", details: "Chat plan monthly pricing; workflow tiers and enterprise plans cost more." }, alternatives: ["Jasper", "HubSpot", "Clay"] },
  Writer: { pricing: { startingMonthly: null, label: "Free trial; paid pricing not public", details: "Starter has a 14-day free trial. Paid plan pricing is not publicly listed." }, alternatives: ["Jasper", "Grammarly", "Microsoft Copilot"] },
  Grammarly: { pricing: { startingMonthly: 12, label: "From $12/month", details: "Pro plan starting price; a free plan and 7-day trial are available." }, alternatives: ["LanguageTool", "QuillBot", "ProWritingAid"] },
  QuillBot: { pricing: { startingMonthly: 8.33, label: "From $8.33/month", details: "Premium annual-billing equivalent; a free plan is available." }, alternatives: ["Grammarly", "Wordtune", "LanguageTool"] },
  Surfer: { pricing: { startingMonthly: 59, label: "From $59/month", details: "Starting plan price reported in the review research; check current document limits before buying." }, alternatives: ["Clearscope", "Frase", "NeuronWriter"] },
  Clearscope: { pricing: { startingMonthly: 129, label: "From $129/month", details: "Essentials monthly plan; 14-day free trial. Additional usage can cost extra." }, alternatives: ["Surfer", "Frase", "MarketMuse"] },
};

const DEFAULT_MARKET_DETAILS: Pick<Review, "pricing" | "alternatives"> = {
  pricing: { startingMonthly: null, label: "Pricing not verified", details: "We have not verified public plan pricing for this tool yet." },
  alternatives: ["No alternatives added yet"],
};

export function verdictFromScore(score: number): Verdict {
  if (score < 3) return "SLOP";
  if (score <= 5) return "FLAWED";
  if (score <= 7.5) return "PASSABLE";
  return "APPROVED";
}

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
    score: Number.isFinite(review.score) ? review.score! : RESEARCH_BRIEF_SCORES[review.id] ?? 5.0,
  })).map((review) => {
    const defaults = MARKET_DETAILS[review.toolName] ?? DEFAULT_MARKET_DETAILS;
    return {
      ...review,
      category: CATEGORY_BY_TOOL[review.toolName] ?? review.category as Category,
      verdict: verdictFromScore(review.score),
      pricing: review.pricing ?? defaults.pricing,
      alternatives: review.alternatives ?? defaults.alternatives,
    };
  });
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
  return getAllReviews().filter((review) => review.verdict === "APPROVED");
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
    approved: reviews.filter((r) => r.verdict === "APPROVED").length,
    slop: reviews.filter((r) => r.verdict === "SLOP").length,
    flawed: reviews.filter((r) => r.verdict === "FLAWED").length,
    passable: reviews.filter((r) => r.verdict === "PASSABLE").length,
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

export async function getCommentsForReview(reviewSlug: string): Promise<ReviewComment[]> {
  const comments = await readJsonFile<ReviewComment>(COMMENTS_FILE);
  return comments.filter((comment) => comment.reviewSlug === reviewSlug).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function addReviewComment(input: Omit<ReviewComment, "id" | "createdAt">): Promise<ReviewComment> {
  const comments = await readJsonFile<ReviewComment>(COMMENTS_FILE);
  const comment: ReviewComment = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  await writeJsonFile(COMMENTS_FILE, [...comments, comment]);
  return comment;
}

export async function addRerateRequest(input: Omit<RerateRequest, "id" | "submittedAt">): Promise<RerateRequest> {
  const requests = await readJsonFile<RerateRequest>(RERATE_FILE);
  const request: RerateRequest = { ...input, id: crypto.randomUUID(), submittedAt: new Date().toISOString() };
  await writeJsonFile(RERATE_FILE, [...requests, request]);
  return request;
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
