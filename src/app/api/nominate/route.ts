import { addNomination } from "@/lib/reviews";
import { checkRateLimit, parseJsonRequest } from "@/lib/request-security";
import { nominationSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request, "nominate", { limit: 3, windowMs: 60 * 60 * 1000 });
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many nominations. Please try again later." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds), "Cache-Control": "no-store" } });
    }

    const result = nominationSchema.safeParse(await parseJsonRequest(request, 8 * 1024));
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message ?? "Invalid request." }, { status: 400, headers: { "Cache-Control": "no-store" } });
    }

    if (result.data.website) return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });

    const { toolName, toolUrl, reason } = result.data;
    const nomination = await addNomination({ toolName, toolUrl: toolUrl || undefined, reason });

    return NextResponse.json({ success: true, id: nomination.id }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const status = message === "PAYLOAD_TOO_LARGE" ? 413 : message === "UNSUPPORTED_MEDIA_TYPE" ? 415 : message === "INVALID_JSON" ? 400 : 500;
    const responseMessage = status === 413 ? "Request is too large." : status === 500 ? "Unable to save your nomination right now." : "Invalid request.";
    return NextResponse.json({ error: responseMessage }, { status, headers: { "Cache-Control": "no-store" } });
  }
}
