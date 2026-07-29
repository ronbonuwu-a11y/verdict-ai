import { AccountForm } from "@/components/AccountForm";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (user) redirect("/");
  return <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_.85fr] lg:items-center"><div><p className="text-base font-black uppercase tracking-[0.16em] text-red-400">Your account</p><h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-white sm:text-5xl">Save your place in the signal.</h1><p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-400">Accounts are the secure foundation for future personal features, such as saved tools and your own nomination history. Public reviews and nominations stay open to everyone.</p><Link href="/" className="mt-7 inline-block text-sm font-semibold text-white underline decoration-red-500 underline-offset-4">Back to verdicts</Link></div><AccountForm /></div>;
}
