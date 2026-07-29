"use client";

import { commentSchema } from "@/lib/validation";
import type { ReviewComment } from "@/types/review";
import Link from "next/link";
import { FormEvent, useState } from "react";

export function ReviewComments({ slug, initialComments, canComment }: { slug: string; initialComments: ReviewComment[]; canComment: boolean }) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = commentSchema.safeParse({ body, website });
    if (!result.success) { setStatus("error"); setMessage(result.error.issues[0]?.message ?? "Please check your comment."); return; }
    setStatus("loading"); setMessage("");
    try { const response = await fetch(`/api/reviews/${slug}/comments`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result.data) }); const data = await response.json(); if (!response.ok) { setStatus("error"); setMessage(data.error ?? "Unable to post your comment."); return; } if (data.comment) setComments((current) => [...current, data.comment]); setBody(""); setStatus("idle"); } catch { setStatus("error"); setMessage("Network error. Please try again."); }
  }
  return <section className="mb-10 border-t border-zinc-800 pt-10"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-base font-black uppercase tracking-[0.16em] text-red-400">Community notes</p><h2 className="mt-2 text-2xl font-bold text-white">Used it? Add your receipts.</h2></div><p className="text-sm text-zinc-500">{comments.length} comment{comments.length === 1 ? "" : "s"}</p></div>{canComment ? <form onSubmit={submit} className="mt-6"><div className="sr-only" aria-hidden="true"><label htmlFor="comment-website">Leave empty</label><input id="comment-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div><label htmlFor="comment-body" className="mb-2 block text-sm font-medium text-zinc-300">What happened when you used it?</label><textarea id="comment-body" required minLength={20} maxLength={1000} rows={4} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Share the task you tried, what worked, and what didn’t." className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500" /><div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-zinc-500">{body.length}/1000</span><button disabled={status === "loading"} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60">{status === "loading" ? "Posting…" : "Post comment"}</button></div>{message && <p className="mt-3 text-sm text-red-400" role="alert">{message}</p>}</form> : <p className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-400"><Link href="/account" className="font-semibold text-white underline decoration-red-500 underline-offset-4">Create an account or sign in</Link> to share your experience. Comments are tied to an authenticated account.</p>}<div className="mt-8 space-y-4">{comments.length === 0 ? <p className="text-sm text-zinc-500">No community notes yet. Be the first person to add real-world context.</p> : comments.map((comment) => <article key={comment.id} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5"><div className="flex items-center justify-between gap-4"><p className="text-sm font-bold text-white">Community member</p><time dateTime={comment.createdAt} className="text-xs text-zinc-500">{new Date(comment.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time></div><p className="mt-3 whitespace-pre-wrap leading-relaxed text-zinc-300">{comment.body}</p></article>)}</div></section>;
}
