import { RerateForm } from "@/components/RerateForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Request a re-rate", description: "Submit verifiable evidence for a Rate That AI re-rating." };

export default function ReratePage() {
  return <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6"><p className="text-base font-black uppercase tracking-[0.16em] text-red-400">Rating review</p><h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">Think we got it wrong?</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">We will consider a re-test when there is meaningful new evidence: a material product update, reproducible results, or an error in our original review. A request does not guarantee a changed rating.</p><div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8"><h2 className="text-xl font-bold text-white">Send the evidence</h2><p className="mt-2 text-sm leading-relaxed text-zinc-400">Be specific. Marketing language alone is not enough; tell us what to test and how to verify it.</p><div className="mt-7"><RerateForm /></div></div></div>;
}
