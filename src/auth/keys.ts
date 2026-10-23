/**
 * Orcein API Key and Metering Engine
 */

export interface KeyRecord {
  id: string;
  key: string;
  tier: "starter" | "pro" | "enterprise" | "internal";
  email: string;
  createdAt: number;
  creditsTotal: number;
  creditsRemaining: number;
  status: "active" | "suspended";
}

export interface AuthResult {
  authenticated: boolean;
  tier: string;
  keyRecord?: KeyRecord;
  error?: string;
  statusCode?: number;
}

/**
 * Generate a cryptographically secure Orcein API key
 */
export function generateApiKey(isLive = true): string {
  const prefix = isLive ? "orcein_live_" : "orcein_test_";
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
  return `${prefix}${hex}`;
}

/**
 * Validate incoming API key or evaluate IP free-tier quota
 */
export async function authenticateRequest(
  request: Request,
  kv: KVNamespace | undefined
): Promise<AuthResult> {
  // Extract key from Authorization header or ?key query param
  const authHeader = request.headers.get("Authorization");
  const url = new URL(request.url);
  const queryKey = url.searchParams.get("key");

  let key: string | null = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    key = authHeader.substring(7).trim();
  } else if (queryKey) {
    key = queryKey.trim();
  }

  // If KV is not configured (e.g. local unit tests without bindings), allow with internal tier
  if (!kv) {
    return { authenticated: true, tier: "development" };
  }

  // If an API key is provided, validate against KV
  if (key) {
    const rawRecord = await kv.get(`key:${key}`);
    if (!rawRecord) {
      return {
        authenticated: false,
        tier: "none",
        error: "Invalid or expired API key. Please check your credentials.",
        statusCode: 401
      };
    }

    try {
      const record: KeyRecord = JSON.parse(rawRecord);
      if (record.status !== "active") {
        return {
          authenticated: false,
          tier: record.tier,
          error: "API key is suspended.",
          statusCode: 403
        };
      }

      if (record.creditsRemaining <= 0) {
        return {
          authenticated: false,
          tier: record.tier,
          error: "API credit balance exhausted. Please top up your subscription.",
          statusCode: 402
        };
      }

      // Decrement credit count asynchronously (eventually consistent)
      record.creditsRemaining -= 1;
      await kv.put(`key:${key}`, JSON.stringify(record));

      return {
        authenticated: true,
        tier: record.tier,
        keyRecord: record
      };
    } catch {
      return {
        authenticated: false,
        tier: "none",
        error: "Malformed key record in store.",
        statusCode: 500
      };
    }
  }

  // Free Tier IP Metering (5 requests per hour)
  const clientIp = request.headers.get("cf-connecting-ip") || "unknown-ip";
  const ipKey = `ip_quota:${clientIp}`;
  const ipCountStr = await kv.get(ipKey);
  const currentCount = ipCountStr ? parseInt(ipCountStr, 10) : 0;

  if (currentCount >= 5) {
    return {
      authenticated: false,
      tier: "free",
      error: "Free tier hourly limit (5 requests) reached. Upgrade to an Orcein API plan for high-volume access.",
      statusCode: 402
    };
  }

  // Increment IP usage with 1 hour (3600s) TTL
  await kv.put(ipKey, (currentCount + 1).toString(), { expirationTtl: 3600 });

  return {
    authenticated: true,
    tier: "free-tier"
  };
}
