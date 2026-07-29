"use client";

import { FormEvent, useState } from "react";
import { subscribeSchema } from "@/lib/validation";

export function EmailSignup() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = subscribeSchema.safeParse({ email, website });
    if (!result.success) {
      setStatus("error");
      setMessage(result.error.issues[0]?.message ?? "Please check your email address.");
      return;
    }
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage("You're on the list. New verdicts coming your way.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8">
      <h2 className="text-2xl font-bold text-white">Get verdicts in your inbox</h2>
      <p className="mt-2 max-w-xl text-sm text-zinc-400">
        Own your audience. Get new reviews, &ldquo;Actually Good&rdquo; picks, and
        tool nominations before they hit Instagram.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="signup-website">Leave this field empty</label>
          <input id="signup-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
        >
          {status === "loading" ? "Joining..." : "Subscribe"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
    </section>
  );
}
