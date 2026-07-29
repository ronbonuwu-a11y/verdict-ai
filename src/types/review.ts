export type Verdict = "PASSES" | "FAILS" | "MIXED" | "QUALIFIED PASS";

export type Category =
  | "Writing Tools"
  | "Image Tools"
  | "Productivity"
  | "Video Tools"
  | "Other";

export interface Review {
  id: string;
  slug: string;
  toolName: string;
  category: Category;
  verdict: Verdict;
  score: number;
  claim: string;
  summary: string;
  methodology: string;
  results: string[];
  testedAt: string;
  instagramUrl?: string;
  affiliateUrl?: string;
  isSponsored?: boolean;
  sponsorLabel?: string;
  extendedBreakdown?: string;
  reviewStage?: "RESEARCH BRIEF — HANDS-ON TEST PENDING";
  researchSources?: { label: string; url: string }[];
  featuredInNewsletter?: boolean;
}

export interface Nomination {
  id: string;
  toolName: string;
  toolUrl?: string;
  reason: string;
  submittedAt: string;
  upvotes: number;
}

export interface ReviewComment {
  id: string;
  reviewSlug: string;
  userId: string;
  body: string;
  createdAt: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface NewsletterIssue {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  reviewSlugs: string[];
}

export interface AgencyInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  service: AgencyService;
  message: string;
  submittedAt: string;
}

export type AgencyService =
  | "GEO Audit"
  | "Content Strategy"
  | "Claim Alignment"
  | "Verdict Consultation";
