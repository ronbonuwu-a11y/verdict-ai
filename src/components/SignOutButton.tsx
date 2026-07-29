"use client";

import { useState } from "react";

export function SignOutButton() {
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    try { await fetch("/api/auth/logout", { method: "POST" }); } finally { window.location.assign("/"); }
  }
  return <button type="button" onClick={signOut} disabled={busy} className="text-sm font-medium text-zinc-300 transition hover:text-white disabled:opacity-60">{busy ? "Signing out…" : "Sign out"}</button>;
}
