"use client";

import { credentialsSchema } from "@/lib/validation";
import { FormEvent, useState } from "react";

export function AccountForm() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = credentialsSchema.safeParse({ email, password, website });
    if (!result.success) { setStatus("error"); setMessage(result.error.issues[0]?.message ?? "Please check your details."); return; }
    setStatus("loading"); setMessage("");
    try {
      const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result.data) });
      const data = await response.json();
      if (!response.ok) { setStatus("error"); setMessage(data.error ?? "Unable to continue."); return; }
      window.location.assign("/");
    } catch { setStatus("error"); setMessage("Network error. Please try again."); }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-8">
      <div className="mb-7 grid grid-cols-2 rounded-xl bg-zinc-950 p-1">
        {(["register", "login"] as const).map((item) => <button key={item} type="button" onClick={() => { setMode(item); setMessage(""); }} className={`rounded-lg px-3 py-2 text-sm font-bold capitalize transition ${mode === item ? "bg-white text-zinc-950" : "text-zinc-400 hover:text-white"}`}>{item === "register" ? "Create account" : "Sign in"}</button>)}
      </div>
      <form onSubmit={submit} className="space-y-5">
        <div className="sr-only" aria-hidden="true"><label htmlFor="account-website">Leave this empty</label><input id="account-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
        <div><label htmlFor="account-email" className="mb-2 block text-sm font-medium text-zinc-300">Email</label><input id="account-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" /></div>
        <div><label htmlFor="account-password" className="mb-2 block text-sm font-medium text-zinc-300">Password</label><input id="account-password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={12} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" /><p className="mt-2 text-xs text-zinc-500">Use at least 12 characters.</p></div>
        <button disabled={status === "loading"} className="w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60">{status === "loading" ? "Please wait…" : mode === "register" ? "Create secure account" : "Sign in"}</button>
        {message && <p className="text-sm text-red-400" role="alert">{message}</p>}
      </form>
    </div>
  );
}
