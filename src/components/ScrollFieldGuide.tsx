"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const chapters = [
  {
    number: "01",
    label: "The gap",
    title: "The demo is not the day-to-day.",
    body: "AI tools are usually introduced at their best. But people need to know what happens after the tab is open: the edge cases, friction, and real cost of relying on it.",
    metric: "REALITY / AFTER THE DEMO",
  },
  {
    number: "02",
    label: "The queue",
    title: "The internet helps decide what we investigate.",
    body: "The best review targets are the ones people are already debating. Nominations turn audience curiosity and skepticism into the next tool on the bench.",
    metric: "COMMUNITY / SETS THE AGENDA",
  },
  {
    number: "03",
    label: "The upside",
    title: "A pass should feel earned.",
    body: "Verdict AI is not a dunk account. We want genuinely useful products to be easier to find, and a strong result to mean more than a shiny launch video.",
    metric: "DISCOVERY / FOR THE GOOD STUFF",
  },
  {
    number: "04",
    label: "The line",
    title: "The verdict is never for sale.",
    body: "The platform only works if the review stays independent. Commercial work is disclosed and separated; money does not move a published conclusion.",
    metric: "TRUST / IS THE PRODUCT",
  },
] as const;

export function ScrollFieldGuide() {
  const [active, setActive] = useState(0);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;

    const updateActiveChapter = () => {
      frame = 0;
      // Keeping a stable reading line above the center makes the state feel
      // intentional while users scroll through a chapter, rather than switching
      // whenever two chapters are partially visible at once.
      const readingLine = window.innerHeight * 0.42;
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      chapterRefs.current.forEach((chapter, index) => {
        if (!chapter) return;
        const distance = Math.abs(chapter.getBoundingClientRect().top - readingLine);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      setActive((current) => (current === nearestIndex ? current : nearestIndex));
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveChapter);
    };

    updateActiveChapter();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="mb-20 border-y border-zinc-800 bg-zinc-900/20 py-16 sm:py-24" aria-label="The Verdict AI field guide">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 max-w-xl">
          <p className="text-base font-black uppercase tracking-[0.16em] text-red-400">Why we&apos;re here</p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-white sm:text-5xl">Less launch theater. More useful answers.</h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-10 lg:h-fit">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-zinc-800 bg-zinc-950 p-7 sm:p-9">
              <div className="field-guide-glow absolute -right-12 -top-12 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" aria-hidden="true" />
              <p className="relative font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">Now reading</p>
              <p className="relative mt-5 text-7xl font-black tracking-[-0.08em] text-white">{chapters[active].number}</p>
              <p className="relative mt-4 text-base font-black uppercase tracking-[0.16em] text-red-400">{chapters[active].label}</p>
              <div className="relative mt-10 flex gap-2" aria-hidden="true">
                {chapters.map((chapter, index) => <span key={chapter.number} className={`h-1 flex-1 rounded-full transition-colors ${active === index ? "bg-red-500" : "bg-zinc-800"}`} />)}
              </div>
              <p className="relative mt-4 font-mono text-[10px] uppercase tracking-[0.13em] text-zinc-500">{chapters[active].metric}</p>
            </div>
          </div>

          <div className="space-y-16 sm:space-y-24">
            {chapters.map((chapter, index) => (
              <article key={chapter.number} ref={(element) => { chapterRefs.current[index] = element; }} className={`scroll-chapter border-l-2 pl-6 transition-[border-color,opacity] duration-500 ease-out sm:pl-9 ${active === index ? "border-red-500 opacity-100" : "border-zinc-800 opacity-55"}`}>
                <p className="font-mono text-xs text-zinc-500">{chapter.number} — {chapter.label}</p>
                <h3 className="mt-4 max-w-xl text-3xl font-bold leading-[1.04] tracking-[-0.04em] text-white sm:text-4xl">{chapter.title}</h3>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-400">{chapter.body}</p>
              </article>
            ))}
            <div className="flex flex-wrap gap-3 border-l-2 border-zinc-800 pl-6 sm:pl-9">
              <Link href="/submit" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-zinc-950 transition hover:scale-[1.03] motion-reduce:hover:scale-100">Nominate a tool</Link>
              <Link href="/editorial-policy" className="rounded-full border border-zinc-700 px-5 py-3 text-sm font-bold text-zinc-200 transition hover:border-white hover:text-white">Read our policy</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
