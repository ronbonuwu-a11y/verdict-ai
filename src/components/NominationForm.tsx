"use client";

import { FormEvent, useState } from "react";
import { nominationSchema } from "@/lib/validation";

export function NominationForm() {
  const [toolName, setToolName] = useState("");
  const [toolUrl, setToolUrl] = useState("");
  const [reason, setReason] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = nominationSchema.safeParse({ toolName, toolUrl, reason, website });
    if (!result.success) {
      setStatus("error");
      setMessage(result.error.issues[0]?.message ?? "Please check the form and try again.");
      return;
    }
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/nominate", {
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
      setMessage("Nomination received. We'll add it to the testing queue.");
      setToolName("");
      setToolUrl("");
      setReason("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="nomination-website">Leave this field empty</label>
        <input id="nomination-website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <div>
        <label htmlFor="toolName" className="mb-2 block text-sm font-medium text-zinc-300">
          Tool name *
        </label>
        <input
          id="toolName"
          required
          value={toolName}
          onChange={(e) => setToolName(e.target.value)}
          placeholder="e.g. WriteSmart AI"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <div>
        <label htmlFor="toolUrl" className="mb-2 block text-sm font-medium text-zinc-300">
          Tool URL (optional)
        </label>
        <input
          id="toolUrl"
          type="url"
          value={toolUrl}
          onChange={(e) => setToolUrl(e.target.value)}
          placeholder="https://"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <div>
        <label htmlFor="reason" className="mb-2 block text-sm font-medium text-zinc-300">
          Why should we test it? *
        </label>
        <textarea
          id="reason"
          required
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="What claim caught your attention? What do you want us to verify?"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
      >
        {status === "loading" ? "Submitting..." : "Submit nomination"}
      </button>

      {message && (
        <p
          className={`text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
