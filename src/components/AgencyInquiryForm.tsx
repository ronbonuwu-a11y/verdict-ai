"use client";

import { FormEvent, useState } from "react";
import { agencyServices } from "@/lib/config";
import type { AgencyService } from "@/types/review";

export function AgencyInquiryForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState<AgencyService>("GEO Audit");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setStatusMessage("");

    try {
      const res = await fetch("/api/agency/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, service, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setStatusMessage(data.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setStatusMessage(
        "Inquiry received. We'll respond within 2 business days.",
      );
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
    } catch {
      setStatus("error");
      setStatusMessage("Network error. Try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-300">
            Name *
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-300">
            Email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="mb-2 block text-sm font-medium text-zinc-300">
          Company *
        </label>
        <input
          id="company"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <div>
        <label htmlFor="service" className="mb-2 block text-sm font-medium text-zinc-300">
          Service *
        </label>
        <select
          id="service"
          required
          value={service}
          onChange={(e) => setService(e.target.value as AgencyService)}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          {agencyServices.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-zinc-300">
          Tell us about your product *
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What does your AI tool do? What claims are you making?"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-60"
      >
        {status === "loading" ? "Submitting..." : "Request consultation"}
      </button>

      {statusMessage && (
        <p
          className={`text-sm ${status === "success" ? "text-emerald-400" : "text-red-400"}`}
        >
          {statusMessage}
        </p>
      )}
    </form>
  );
}
