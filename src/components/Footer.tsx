import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Rate That AI — Independent AI tool reviews. No paid rating changes.</p>
        <div className="flex gap-4">
          <Link className="transition hover:text-white" href="/methodology">Methodology</Link>
          <Link className="transition hover:text-white" href="/editorial-policy">Editorial policy</Link>
          <Link className="transition hover:text-white" href="/rerate">Request a re-rate</Link>
        </div>
      </div>
    </footer>
  );
}
