import { authenticateUser, createSession, sessionCookie } from "@/lib/auth";
import { checkRateLimit, parseJsonRequest } from "@/lib/request-security";
import { credentialsSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request, "login", { limit: 8, windowMs: 15 * 60 * 1000 });
    if (!rateLimit.allowed) return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds), "Cache-Control": "no-store" } });
    const result = credentialsSchema.safeParse(await parseJsonRequest(request, 4 * 1024));
    if (!result.success) return NextResponse.json({ error: "Invalid email or password." }, { status: 400, headers: { "Cache-Control": "no-store" } });
    if (result.data.website) return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
    const user = await authenticateUser(result.data.email, result.data.password);
    if (!user) return NextResponse.json({ error: "Invalid email or password." }, { status: 401, headers: { "Cache-Control": "no-store" } });
    const session = await createSession(user.id);
    const response = NextResponse.json({ success: true, user }, { headers: { "Cache-Control": "no-store" } });
    response.cookies.set(sessionCookie(session.token, session.expiresAt));
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
