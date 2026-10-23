/**
 * Orcein Labs Edge API & Revenue Router
 * Host: api.orceinlabs.com
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { extractMarkdown, type DigestOptions } from "./digest/extractor";
import { authenticateRequest } from "./auth/keys";
import { handleStripeWebhook } from "./billing/stripe";
import { getLandingPageHtml } from "./site/landing";

export interface Env {
  ORCEIN_KEYS: KVNamespace;
  ORCEIN_CACHE: KVNamespace;
  STRIPE_WEBHOOK_SECRET?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for all agent origins & web apps
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Orcein-Key", "Accept"]
  })
);

// Health & Discovery & Landing Page
app.get("/", (c) => {
  const url = new URL(c.req.url);
  const accept = c.req.header("Accept") || "";
  const isSiteHost = url.hostname === "orceinlabs.com" || url.hostname === "www.orceinlabs.com";

  if (isSiteHost || accept.includes("text/html")) {
    return c.html(getLandingPageHtml());
  }

  return c.json({
    service: "Orcein Labs Core Edge API",
    organization: "Orcein Labs",
    version: "1.0.0",
    docs: "https://github.com/Orcein-Labs/orcein-api",
    site: "https://orceinlabs.com",
    endpoints: {
      digest: {
        method: "GET | POST",
        path: "/v1/digest",
        description: "High-velocity web page / document context extractor and token minifier for AI agents."
      },
      stripeWebhook: {
        method: "POST",
        path: "/v1/webhooks/stripe",
        description: "Automated billing and API key provisioning."
      },
      health: {
        method: "GET",
        path: "/health"
      }
    }
  });
});

app.get("/terms", (c) => c.html(getLandingPageHtml()));
app.get("/privacy", (c) => c.html(getLandingPageHtml()));
app.get("/refunds", (c) => c.html(getLandingPageHtml()));

app.get("/health", (c) => c.json({ status: "healthy", timestamp: Date.now() }));

// Stripe Webhook Endpoint
app.post("/v1/webhooks/stripe", async (c) => {
  return handleStripeWebhook(c.req.raw, c.env);
});

// Primary Context Digest Endpoint (GET & POST)
const handleDigest = async (c: any) => {
  const startTime = performance.now();

  // 1. Authenticate & Meter
  const auth = await authenticateRequest(c.req.raw, c.env?.ORCEIN_KEYS);
  if (!auth.authenticated) {
    return c.json(
      {
        error: auth.error || "Authentication required",
        tier: auth.tier,
        upgradeUrl: "https://orceinlabs.com"
      },
      (auth.statusCode as any) || 401
    );
  }

  // 2. Parse Request Parameters
  let targetUrl: string | null = null;
  let rawHtml: string | null = null;
  let maxTokens: number | undefined;
  let preserveLinks = true;

  if (c.req.method === "GET" || c.req.method === "HEAD") {
    targetUrl = c.req.query("url") || null;
    const maxTokensParam = c.req.query("max_tokens");
    if (maxTokensParam) maxTokens = parseInt(maxTokensParam, 10);
    if (c.req.query("preserve_links") === "false") preserveLinks = false;
  } else {
    // POST request
    const contentType = c.req.header("Content-Type") || "";
    if (contentType.includes("application/json")) {
      const body = await c.req.json().catch(() => ({}));
      targetUrl = body.url || null;
      rawHtml = body.html || null;
      if (typeof body.max_tokens === "number") maxTokens = body.max_tokens;
      if (body.preserve_links === false) preserveLinks = false;
    } else {
      // Raw HTML / Text body
      rawHtml = await c.req.text();
    }
  }

  if (!targetUrl && !rawHtml) {
    return c.json(
      {
        error: "Missing input. Provide a 'url' query parameter or request body with 'url' or 'html'."
      },
      400
    );
  }

  const options: DigestOptions = { maxTokens, preserveLinks };

  // 3. Process URL or Direct HTML
  if (targetUrl) {
    // Normalize URL
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://${targetUrl}`;
    }

    // Check edge cache if KV is bound
    const cacheKey = `digest:${targetUrl}:${maxTokens || "all"}`;
    if (c.env?.ORCEIN_CACHE) {
      const cached = await c.env.ORCEIN_CACHE.get(cacheKey, "json");
      if (cached) {
        c.header("X-Orcein-Cache", "HIT");
        c.header("X-Orcein-Tier", auth.tier);
        const format = c.req.query("format") || c.req.header("Accept");
        if (format === "markdown" || format === "text/markdown") {
          return c.text((cached as any).markdown);
        }
        return c.json(cached);
      }
    }

    // Fetch live content with 10s timeout
    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; OrceinDigestBot/1.0; +https://orceinlabs.com)",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        },
        redirect: "follow"
      });

      if (!response.ok) {
        return c.json(
          {
            error: `Failed to fetch target URL: upstream returned status ${response.status} ${response.statusText}`,
            targetUrl
          },
          502
        );
      }

      rawHtml = await response.text();
    } catch (err: any) {
      return c.json(
        {
          error: `Network error fetching target URL: ${err.message}`,
          targetUrl
        },
        502
      );
    }
  }

  // 4. Run Core Extraction & Token Minification
  const digestResult = extractMarkdown(rawHtml || "", options);
  const elapsedMs = Math.round((performance.now() - startTime) * 10) / 10;

  const payload = {
    title: digestResult.title,
    url: targetUrl || "raw-input",
    markdown: digestResult.markdown,
    telemetry: {
      ...digestResult.metadata,
      elapsedMs,
      tier: auth.tier
    }
  };

  // Cache in KV if URL was fetched (TTL: 1 hour)
  if (targetUrl && c.env?.ORCEIN_CACHE) {
    const cacheKey = `digest:${targetUrl}:${maxTokens || "all"}`;
    await c.env.ORCEIN_CACHE.put(cacheKey, JSON.stringify(payload), { expirationTtl: 3600 });
  }

  // 5. Response Headers & Format Selection
  c.header("X-Orcein-Cache", "MISS");
  c.header("X-Orcein-Elapsed-MS", elapsedMs.toString());
  c.header("X-Orcein-Tier", auth.tier);
  c.header("X-Orcein-Tokens-Saved", digestResult.metadata.tokensSaved.toString());

  const format = c.req.query("format") || c.req.header("Accept");
  if (format === "markdown" || format === "text/markdown") {
    return c.text(digestResult.markdown);
  }

  return c.json(payload);
};

app.on(["GET", "HEAD"], "/v1/digest", handleDigest);
app.post("/v1/digest", handleDigest);

export default app;
