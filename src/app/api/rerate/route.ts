import { addRerateRequest } from "@/lib/reviews";
import { checkRateLimit, parseJsonRequest } from "@/lib/request-security";
import { rerateSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(request, "rerate", { limit: 3, windowMs: 60 * 60 * 1000 });
  if (!rateLimit.allowed) return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds), "Cache-Control": "no-store" } });
  try {
    const result = rerateSchema.safeParse(await parseJsonRequest(request, 8 * 1024));
    if (!result.success) return NextResponse.json({ error: result.error.issues[0]?.message ?? "Invalid request." }, { status: 400, headers: { "Cache-Control": "no-store" } });
    if (result.data.website) return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
    const { company, email, toolName, reviewUrl, evidence } = result.data;
    const requestRecord = await addRerateRequest({ company, email, toolName, reviewUrl: reviewUrl || undefined, evidence });
    return NextResponse.json({ success: true, id: requestRecord.id }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const status = message === "PAYLOAD_TOO_LARGE" ? 413 : message === "UNSUPPORTED_MEDIA_TYPE" || message === "INVALID_JSON" ? 400 : 500;
    return NextResponse.json({ error: status === 413 ? "Request is too large." : status === 500 ? "Unable to submit your request right now." : "Invalid request." }, { status, headers: { "Cache-Control": "no-store" } });
  }
}
