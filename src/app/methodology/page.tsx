import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How we test",
  description: "The repeatable methodology behind every Verdict AI review.",
};

const steps = [
  ["01", "Capture the claim", "We test the promise a tool makes publicly, not a vague version of what it might be able to do."],
  ["02", "Build a real-world test", "Each review uses practical scenarios, representative inputs, and the same success criteria across comparable tools."],
  ["03", "Document the results", "We record what worked, what failed, edge cases, and the conditions that could change the outcome."],
  ["04", "Publish a clear verdict", "PASSES, QUALIFIED PASS, MIXED, or FAILS — plus a 10-point score and the evidence readers need to decide for themselves."],
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <p className="text-base font-black uppercase tracking-[0.16em] text-red-400">Our methodology</p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight text-white sm:text-5xl">A verdict should be repeatable, not just loud.</h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">We test AI products against the claims that persuaded people to try them. The goal is a useful answer, with enough context for you to challenge it.</p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {steps.map(([number, title, description]) => (
          <section key={number} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <p className="font-mono text-sm text-red-400">{number}</p>
            <h2 className="mt-5 text-xl font-bold text-white">{title}</h2>
            <p className="mt-3 leading-relaxed text-zinc-400">{description}</p>
          </section>
        ))}
      </div>

      <section className="mt-12 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
        <h2 className="text-xl font-bold text-white">What the labels mean</h2>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="font-bold text-emerald-400">PASSES</dt><dd className="mt-1 text-zinc-400">Delivers on its central promise in our test.</dd></div>
          <div><dt className="font-bold text-orange-400">QUALIFIED PASS</dt><dd className="mt-1 text-zinc-400">Useful, with important caveats that limit who should use it.</dd></div>
          <div><dt className="font-bold text-amber-400">MIXED</dt><dd className="mt-1 text-zinc-400">Clear strengths and weaknesses; suitability depends on the job.</dd></div>
          <div><dt className="font-bold text-red-400">FAILS</dt><dd className="mt-1 text-zinc-400">Does not deliver the central claim reliably enough to recommend.</dd></div>
        </dl>
      </section>
      <p className="mt-10 text-zinc-400">Think we missed something? <Link href="/submit" className="font-medium text-white underline decoration-red-500 underline-offset-4">Nominate a tool or send us the claim to test.</Link></p>
    </div>
  );
}
