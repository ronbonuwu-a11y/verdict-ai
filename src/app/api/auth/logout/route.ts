import { destroySession, SESSION_COOKIE } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function tokenFromRequest(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  return cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403, headers: { "Cache-Control": "no-store" } });
  }

  const token = tokenFromRequest(request);
  if (token) await destroySession(token);
  const response = NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set({ name: SESSION_COOKIE, value: "", path: "/", maxAge: 0, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" });
  return response;
}
