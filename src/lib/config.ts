export const siteConfig = {
  name: "Rate That AI",
  tagline: "We test AI tools so you know what's actually worth it.",
  description:
    "Independent AI tool reviews. We test bold marketing claims and deliver clear ratings: SLOP, MIXED, PASSABLE, or APPROVED.",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com",
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? "@ratethatai",
  agencyName: "Verdict GEO",
  agencyTagline: "The critic becomes the consultant.",
} as const;

export const agencyServices = [
  {
    id: "geo-audit",
    name: "GEO Audit" as const,
    description:
      "Assess how your AI tool currently appears in AI-generated recommendations and search results.",
  },
  {
    id: "content-strategy",
    name: "Content Strategy" as const,
    description:
      "Help companies create content that AI systems cite and recommend positively.",
  },
  {
    id: "claim-alignment",
    name: "Claim Alignment" as const,
    description:
      "Ensure marketing claims match actual product performance so you don't get receipted.",
  },
  {
    id: "verdict-consultation",
    name: "Verdict Consultation" as const,
    description:
      "Pre-launch review — test the product before the public does and receive a private report.",
  },
] as const;

export const membershipBenefits = [
  "Early access to new verdicts before Instagram",
  "Extended breakdowns with deeper test notes",
  "Nomination priority in the testing queue",
  "Monthly Actually Good roundup email",
] as const;
