import { NominationForm } from "@/components/NominationForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nominate a Tool",
  description: "Suggest an AI tool for Rate That AI to test against its marketing claims.",
};

export default function SubmitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <p className="mb-3 text-base font-black uppercase tracking-[0.16em] text-red-400">
        Community nominations
      </p>
      <h1 className="text-3xl font-bold text-white sm:text-4xl">
        Nominate a tool to review
      </h1>
      <p className="mt-4 text-zinc-400">
        Spotted an AI tool making bold claims? Send it our way. We prioritize tools
        with strong marketing hype and real user demand.
      </p>

      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <NominationForm />
      </div>
    </div>
  );
}
