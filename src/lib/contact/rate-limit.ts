/**
 * Small in-memory sliding-window rate limiter.
 * Good enough for a single Node instance. On serverless or multi-instance
 * hosting, replace with a shared store (e.g. Redis/Upstash) — see docs/DEPLOYMENT.md.
 */
const buckets = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000,
  now = Date.now(),
): boolean {
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return false;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return true;
}

export function __resetRateLimit() {
  buckets.clear();
}
