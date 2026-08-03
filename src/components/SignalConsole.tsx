"use client";

import Link from "next/link";
import { useState } from "react";
import ClickSpark from "@/components/react-bits/ClickSpark";

const modes = [
  {
    label: "Scan claim",
    eyebrow: "Signal detected",
    headline: "Big claims.\nSmall print.",
    description: "Move through the noise. We put AI promises under a real-world microscope.",
    detail: "INPUT: marketing claim",
    tint: "red",
  },
  {
    label: "Run test",
    eyebrow: "Test in progress",
    headline: "Put it\nto work.",
    description: "No benchmark theater. We use the tools in the awkward, ordinary ways people actually need them.",
    detail: "INPUT: real-world scenario",
    tint: "amber",
  },
  {
    label: "Read verdict",
    eyebrow: "Receipts ready",
    headline: "Truth,\nwith context.",
    description: "Every verdict shows the claim, the test, and the results—so you can make the call too.",
    detail: "OUTPUT: independent verdict",
    tint: "emerald",
  },
] as const;

export function SignalConsole({ total }: { total: number }) {
  const [active, setActive] = useState(0);
  const mode = modes[active];

  return (
    <section className={`signal-console signal-${mode.tint} relative mb-16 overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/50 px-6 py-8 sm:px-10 sm:py-12`}>
      <ClickSpark sparkColor="#ef4444" sparkCount={12} sparkRadius={34} sparkSize={12} duration={520}>
        <div className="signal-grid absolute inset-0 opacity-50" aria-hidden="true" />
        <div className="signal-orb absolute -right-20 -top-24 h-72 w-72 rounded-full" aria-hidden="true" />
        <div className="relative grid items-end gap-10 lg:grid-cols-[1.15fr_.85fr]">
        <div>
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-zinc-400">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-50 motion-reduce:hidden" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-current" /></span>
            {mode.eyebrow}
          </div>
          <h1 className="mt-6 whitespace-pre-line text-5xl font-black leading-[0.9] tracking-[-0.07em] text-white sm:text-7xl">
            {mode.headline}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-300 sm:text-lg">{mode.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#database" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hover:scale-100">Explore {total} verdicts</Link>
            <Link href="/methodology" className="rounded-full border border-zinc-600 px-5 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-white/10">How we test</Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm rounded-[1.75rem] border border-white/15 bg-zinc-950/75 p-5 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            <span>Verdict terminal</span><span>v.01</span>
          </div>
          <div className="relative mt-5 aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
            <div className="scanner-line absolute inset-x-0 top-0 h-px bg-white/80 shadow-[0_0_18px_4px_currentColor]" aria-hidden="true" />
            <div className="absolute inset-5 rounded-full border border-dashed border-zinc-600 motion-safe:animate-[spin_18s_linear_infinite]" aria-hidden="true" />
            <div className="absolute inset-11 rounded-full border border-zinc-700" aria-hidden="true" />
            <div className="absolute inset-[29%] grid place-items-center rounded-full border border-white/20 bg-zinc-950 text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">{mode.detail}</span>
            </div>
            <span className="absolute left-5 top-5 font-mono text-[10px] text-zinc-500">01 / 03</span>
            <span className="absolute bottom-5 right-5 font-mono text-[10px] text-zinc-500">LIVE</span>
          </div>
          <div className="mt-5" role="tablist" aria-label="Explore the Rate That AI process">
            <div className="grid grid-cols-3 gap-2">
              {modes.map((item, index) => (
                <button key={item.label} type="button" role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={`rounded-xl px-2 py-3 text-left text-xs font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${active === index ? "bg-white text-zinc-950" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}>
                  <span className="mb-1 block font-mono text-[9px] opacity-60">0{index + 1}</span>{item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        </div>
      </ClickSpark>
    </section>
  );
}
