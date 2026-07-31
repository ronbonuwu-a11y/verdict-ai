"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ReviewSearch } from "@/components/ReviewSearch";
import type { Review } from "@/types/review";

interface HomeReviewExplorerProps { reviews: Review[]; categories: string[]; approvedCount: number; slopCount: number; }

export function HomeReviewExplorer({ reviews, categories, approvedCount, slopCount }: HomeReviewExplorerProps) {
  const [query, setQuery] = useState("");
  const [hasHandedOff, setHasHandedOff] = useState(false);
  const databaseRef = useRef<HTMLElement>(null);
  const databaseInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { const database = databaseRef.current; if (!database) return; const observer = new IntersectionObserver(([entry]) => setHasHandedOff(entry.isIntersecting), { rootMargin: "-18% 0px -60% 0px", threshold: 0 }); observer.observe(database); return () => observer.disconnect(); }, []);
  function openDatabase() { databaseRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); window.setTimeout(() => databaseInputRef.current?.focus(), 450); }
  return <>
    <div className={`sticky top-3 z-30 mb-14 transition duration-300 motion-reduce:transition-none sm:mb-16 ${hasHandedOff ? "pointer-events-none -translate-y-3 opacity-0" : "translate-y-0 opacity-100"}`}><div className="rounded-3xl border border-slate-400/70 bg-white/90 p-4 shadow-xl shadow-slate-900/10 backdrop-blur"><div className="flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="top-tool-search">Find an AI tool</label><input id="top-tool-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") openDatabase(); }} placeholder="Find an AI tool, claim, or verdict..." className="min-w-0 flex-1 rounded-2xl border border-slate-300 bg-white px-5 py-4 text-base text-slate-900 placeholder:text-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" /><button type="button" onClick={openDatabase} className="database-search-button rounded-2xl border border-slate-900 bg-slate-900 px-6 py-4 text-sm font-bold text-white transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Search tools</button></div><p className="mt-3 text-sm text-slate-500">Search {reviews.length} independent tool verdicts. Press Enter to open the database.</p></div></div>
    <section className="mb-20 sm:mb-24"><p className="mb-5 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">At a glance</p><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-3xl border border-slate-400/70 bg-white/70 p-7"><p className="text-5xl font-bold tracking-tight text-slate-900">{reviews.length}</p><p className="mt-3 text-sm font-medium uppercase tracking-wider text-slate-500">Tools tested</p></div><div className="rounded-3xl border border-slate-400/70 bg-white/70 p-7"><p className="text-5xl font-bold tracking-tight text-emerald-700">{approvedCount}</p><p className="mt-3 text-sm font-medium uppercase tracking-wider text-slate-500">Approved</p></div><div className="rounded-3xl border border-slate-400/70 bg-white/70 p-7"><p className="text-5xl font-bold tracking-tight text-red-600">{slopCount}</p><p className="mt-3 text-sm font-medium uppercase tracking-wider text-slate-500">Slop</p></div></div></section>
    <section ref={databaseRef} id="database" className="mb-20 scroll-mt-6"><div className="mb-8 flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">The database</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Every claim gets receipts.</h2></div><Link href="/editorial-policy" className="text-sm font-semibold text-slate-600 underline decoration-red-500 underline-offset-4 transition hover:text-slate-950">Our independence promise →</Link></div><div className={`transition duration-300 motion-reduce:transition-none ${hasHandedOff ? "translate-y-0 opacity-100" : "translate-y-2 opacity-80"}`}><ReviewSearch reviews={reviews} categories={categories} query={query} onQueryChange={setQuery} inputRef={databaseInputRef} /></div></section>
  </>;
}
