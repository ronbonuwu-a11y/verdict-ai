export type Verdict = "SLOP" | "FLAWED" | "PASSABLE" | "APPROVED";

export interface PricingInfo {
  startingMonthly: number | null;
  label: string;
  details: string;
}

export type Category =
  | "Writing & Research"
  | "Marketing & GTM"
  | "Enterprise Automation"
  | "Productivity"
  | "Image Generation & Editing"
  | "Video Editing"
  | "SEO & Discoverability"
  | "Entertainment & Creative"
  | "Other";

export interface Review {
  id: string;
  slug: string;
  toolName: string;
  category: Category;
  verdict: Verdict;
  score: number;
  pricing: PricingInfo;
  alternatives: string[];
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

export interface RerateRequest {
  id: string;
  company: string;
  email: string;
  toolName: string;
  reviewUrl?: string;
  evidence: string;
  submittedAt: string;
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
