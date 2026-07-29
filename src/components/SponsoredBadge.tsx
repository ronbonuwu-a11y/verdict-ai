interface SponsoredBadgeProps {
  label?: string;
}

export function SponsoredBadge({ label = "Paid Review" }: SponsoredBadgeProps) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400 ring-1 ring-inset ring-blue-500/30">
      {label}
    </span>
  );
}
