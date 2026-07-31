"use client";

import { FormEvent, useState } from "react";
import type { Category, Review, Verdict } from "@/types/review";

const CATEGORIES: Category[] = [
  "Writing & Research",
  "Marketing & GTM",
  "Enterprise Automation",
  "Productivity",
  "Image Generation & Editing",
  "Video Editing",
  "SEO & Discoverability",
  "Entertainment & Creative",
  "Other",
];

const VERDICTS: Verdict[] = ["SLOP", "FLAWED", "PASSABLE", "APPROVED"];

interface AdminReviewFormProps {
  existingReview?: Review;
  onSaved?: () => void;
}

export function AdminReviewForm({ existingReview, onSaved }: AdminReviewFormProps) {
  const [toolName, setToolName] = useState(existingReview?.toolName ?? "");
  const [category, setCategory] = useState<Category>(
    existingReview?.category ?? "Writing & Research",
  );
  const [verdict, setVerdict] = useState<Verdict>(
    existingReview?.verdict ?? "FLAWED",
  );
  const [score, setScore] = useState(existingReview?.score?.toString() ?? "5.0");
  const [startingMonthly, setStartingMonthly] = useState(existingReview?.pricing.startingMonthly?.toString() ?? "");
  const [pricingLabel, setPricingLabel] = useState(existingReview?.pricing.label ?? "");
  const [pricingDetails, setPricingDetails] = useState(existingReview?.pricing.details ?? "");
  const [alternativesText, setAlternativesText] = useState(existingReview?.alternatives.join(", ") ?? "");
  const [claim, setClaim] = useState(existingReview?.claim ?? "");
  const [summary, setSummary] = useState(existingReview?.summary ?? "");
  const [methodology, setMethodology] = useState(
    existingReview?.methodology ?? "",
  );
  const [resultsText, setResultsText] = useState(
    existingReview?.results.join("\n") ?? "",
  );
  const [testedAt, setTestedAt] = useState(
    existingReview?.testedAt ?? new Date().toISOString().slice(0, 10),
  );
  const [instagramUrl, setInstagramUrl] = useState(
    existingReview?.instagramUrl ?? "",
  );
  const [affiliateUrl, setAffiliateUrl] = useState(
    existingReview?.affiliateUrl ?? "",
  );
  const [extendedBreakdown, setExtendedBreakdown] = useState(
    existingReview?.extendedBreakdown ?? "",
  );
  const [isSponsored, setIsSponsored] = useState(
    existingReview?.isSponsored ?? false,
  );
  const [sponsorLabel, setSponsorLabel] = useState(
    existingReview?.sponsorLabel ?? "Paid Review",
  );
  const [featuredInNewsletter, setFeaturedInNewsletter] = useState(
    existingReview?.featuredInNewsletter ?? false,
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const payload = {
      ...(existingReview ? { id: existingReview.id, slug: existingReview.slug } : {}),
      toolName,
      category,
      verdict,
      score: Number(score),
      pricing: {
        startingMonthly: startingMonthly ? Number(startingMonthly) : null,
        label: pricingLabel || "Pricing not verified",
        details: pricingDetails || "We have not verified public plan pricing for this tool yet.",
      },
      alternatives: alternativesText.split(",").map((item) => item.trim()).filter(Boolean),
      claim,
      summary,
      methodology,
      results: resultsText.split("\n").filter(Boolean),
      testedAt,
      instagramUrl: instagramUrl || undefined,
      affiliateUrl: affiliateUrl || undefined,
      extendedBreakdown: extendedBreakdown || undefined,
      isSponsored,
      sponsorLabel: isSponsored ? sponsorLabel : undefined,
      featuredInNewsletter,
    };

    try {
      const url = existingReview
        ? `/api/admin/reviews/${existingReview.id}`
        : "/api/admin/reviews";
      const method = existingReview ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Failed to save.");
        return;
      }

      setStatus("success");
      setMessage(existingReview ? "Review updated." : "Review published.");
      onSaved?.();

      if (!existingReview) {
        setToolName("");
        setClaim("");
        setSummary("");
        setMethodology("");
        setResultsText("");
        setInstagramUrl("");
        setAffiliateUrl("");
        setExtendedBreakdown("");
        setStartingMonthly("");
        setPricingLabel("");
        setPricingDetails("");
        setAlternativesText("");
      }
    } catch {
      setStatus("error");
      setMessage("Network error.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Tool name *" value={toolName} onChange={setToolName} required />
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <Field label="Score / 10" value={score} onChange={setScore} type="number" required />
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-400">Verdict</label>
          <select
            value={verdict}
            onChange={(e) => setVerdict(e.target.value as Verdict)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
          >
            {VERDICTS.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <Field label="Tested date *" value={testedAt} onChange={setTestedAt} type="date" required />
      </div>

      <Field label="Marketing claim *" value={claim} onChange={setClaim} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Starting price per month (USD)" value={startingMonthly} onChange={setStartingMonthly} type="number" />
        <Field label="Pricing label" value={pricingLabel} onChange={setPricingLabel} />
      </div>
      <TextArea label="Pricing details" value={pricingDetails} onChange={setPricingDetails} rows={2} />
      <Field label="Alternatives (comma separated)" value={alternativesText} onChange={setAlternativesText} />
      <TextArea label="Verdict summary *" value={summary} onChange={setSummary} required />
      <TextArea label="Methodology *" value={methodology} onChange={setMethodology} required />
      <TextArea
        label="Results (one per line) *"
        value={resultsText}
        onChange={setResultsText}
        required
        rows={5}
      />
      <Field label="Instagram Reel URL" value={instagramUrl} onChange={setInstagramUrl} />
      <Field label="Affiliate URL (APPROVED only)" value={affiliateUrl} onChange={setAffiliateUrl} />
      <TextArea
        label="Extended breakdown (members-only)"
        value={extendedBreakdown}
        onChange={setExtendedBreakdown}
        rows={4}
      />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={isSponsored}
            onChange={(e) => setIsSponsored(e.target.checked)}
            className="rounded"
          />
          Sponsored / paid review
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            checked={featuredInNewsletter}
            onChange={(e) => setFeaturedInNewsletter(e.target.checked)}
            className="rounded"
          />
          Feature in newsletter
        </label>
      </div>

      {isSponsored && (
        <Field
          label="Sponsor label"
          value={sponsorLabel}
          onChange={setSponsorLabel}
        />
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
      >
        {status === "loading"
          ? "Saving..."
          : existingReview
            ? "Update review"
            : "Publish review"}
      </button>

      {message && (
        <p className={`text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-400">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  required,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-400">{label}</label>
      <textarea
        required={required}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white"
      />
    </div>
  );
}
