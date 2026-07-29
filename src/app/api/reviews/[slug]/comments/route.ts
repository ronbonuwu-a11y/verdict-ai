import { getRequestUser } from "@/lib/auth";
import { addReviewComment, getReviewBySlug } from "@/lib/reviews";
import { checkRateLimit, parseJsonRequest } from "@/lib/request-security";
import { commentSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getRequestUser(request);
  if (!user) return NextResponse.json({ error: "Sign in to leave a comment." }, { status: 401, headers: { "Cache-Control": "no-store" } });
  const rateLimit = checkRateLimit(request, `comment:${user.id}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rateLimit.allowed) return NextResponse.json({ error: "Too many comments. Please try again later." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds), "Cache-Control": "no-store" } });
  try {
    const { slug } = await params;
    if (!getReviewBySlug(slug)) return NextResponse.json({ error: "Review not found." }, { status: 404, headers: { "Cache-Control": "no-store" } });
    const result = commentSchema.safeParse(await parseJsonRequest(request, 4 * 1024));
    if (!result.success) return NextResponse.json({ error: result.error.issues[0]?.message ?? "Invalid comment." }, { status: 400, headers: { "Cache-Control": "no-store" } });
    if (result.data.website) return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
    const comment = await addReviewComment({ reviewSlug: slug, userId: user.id, body: result.data.body });
    return NextResponse.json({ success: true, comment }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const status = message === "PAYLOAD_TOO_LARGE" ? 413 : message === "UNSUPPORTED_MEDIA_TYPE" || message === "INVALID_JSON" ? 400 : 500;
    return NextResponse.json({ error: status === 413 ? "Request is too large." : status === 500 ? "Unable to post your comment right now." : "Invalid request." }, { status, headers: { "Cache-Control": "no-store" } });
  }
}
