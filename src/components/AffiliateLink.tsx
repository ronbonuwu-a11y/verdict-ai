interface AffiliateLinkProps {
  url: string;
  toolName: string;
}

export function AffiliateLink({ url, toolName }: AffiliateLinkProps) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
      <p className="text-sm font-semibold text-emerald-400">
        Try {toolName}
      </p>
      <p className="mt-1 text-xs text-zinc-500">
        Affiliate link — we may earn a commission at no cost to you. We only
        link tools we rated PASSES.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="mt-3 inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500"
      >
        Visit {toolName} →
      </a>
    </div>
  );
}
