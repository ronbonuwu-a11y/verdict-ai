import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Editorial policy",
  description: "How Rate That AI protects the independence of its reviews.",
};

const commitments = [
  ["No paid verdict changes", "Money, sponsorship, affiliate relationships, and consultations never change a published verdict."],
  ["Clear disclosure", "Sponsored material and affiliate links are labeled where they appear. A commercial relationship is never hidden behind editorial language."],
  ["Comparable testing", "We use a consistent process and show our methodology so readers can understand the basis for each conclusion."],
  ["Public corrections", "If we get a material fact wrong, we correct the review openly rather than quietly rewriting history."],
  ["Separate advisory work", "Private consulting is kept separate from public editorial review. We do not let clients steer coverage of their own products."],
];

export default function EditorialPolicyPage() {
  return (
    <div className="white-canvas-page mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-base font-black uppercase tracking-[0.16em] text-red-400">Trust is the product</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Our editorial policy.</h1>
      <p className="mt-5 text-lg leading-relaxed text-zinc-400">Rate That AI exists to help people make better decisions about AI tools. That only works if our reviews are independent, transparent, and willing to be corrected.</p>

      <div className="mt-12 divide-y divide-zinc-800 rounded-2xl border border-zinc-800 bg-zinc-900/30">
        {commitments.map(([title, description], index) => (
          <section key={title} className="flex gap-5 p-6">
            <span className="font-mono text-sm text-red-400">0{index + 1}</span>
            <div><h2 className="font-bold text-white">{title}</h2><p className="mt-2 leading-relaxed text-zinc-400">{description}</p></div>
          </section>
        ))}
      </div>
      <p className="mt-10 text-zinc-400">Want to understand the test itself? <Link href="/methodology" className="font-medium text-white underline decoration-red-500 underline-offset-4">Read our methodology.</Link></p>
    </div>
  );
}
