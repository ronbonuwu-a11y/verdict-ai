import { createHash } from "crypto";

type RateLimitRule = { limit: number; windowMs: number };
type RateLimitEntry = { count: number; resetAt: number };

const buckets = new Map<string, RateLimitEntry>();

function clientIdentifier(request: Request): string {
  // Hosting platforms set this header after removing any client-supplied value.
  // Hash it before using it as a key so raw IP addresses are not retained in memory.
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const source = forwarded || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(source).digest("hex");
}

export function checkRateLimit(request: Request, namespace: string, rule: RateLimitRule) {
  const now = Date.now();
  const key = `${namespace}:${clientIdentifier(request)}`;
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + rule.windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= rule.limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function parseJsonRequest(request: Request, maxBytes: number): Promise<unknown> {
  const contentType = request.headers.get("content-type") ?? "";
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new Error("UNSUPPORTED_MEDIA_TYPE");
  }
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error("INVALID_JSON");
  }
}
