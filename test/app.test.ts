import { describe, it, expect } from "bun:test";
import app from "../src/index";
import { verifyStripeSignature } from "../src/billing/stripe";

describe("Orcein Edge API Router Integration", () => {
  it("GET / returns service manifest and endpoints", async () => {
    const res = await app.request("https://api.orceinlabs.com/", {
      headers: { Accept: "application/json" }
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.service).toBe("Orcein Labs Core Edge API");
    expect(body.endpoints.digest).toBeDefined();
  });

  it("GET / returns landing page HTML when requested via browser or site host", async () => {
    const res = await app.request("https://orceinlabs.com/", {
      headers: { Accept: "text/html" }
    });
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Orcein Labs");
    expect(html).toContain("Context Digest API");
    expect(html).toContain("contact@orceinlabs.com");
  });

  it("GET /health returns healthy status", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.status).toBe("healthy");
  });

  it("POST /v1/digest with raw HTML extracts clean markdown and telemetry", async () => {
    const htmlPayload = `
      <html>
        <head><title>Orcein NCD Specification</title></head>
        <body>
          <nav>Nav links</nav>
          <h1>Hyperbolic Metric Space</h1>
          <p>NCD computes exact Lyapunov descent in <strong>5D Lorentz space</strong>.</p>
          <pre><code class="language-julia">
mutable struct TrieNode
    center::SVector{5, Float64}
    radius::Float64
end
          </code></pre>
        </body>
      </html>
    `;

    const res = await app.request("/v1/digest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: htmlPayload })
    });

    expect(res.status).toBe(200);
    const data = (await res.json()) as any;
    expect(data.title).toBe("Orcein NCD Specification");
    expect(data.markdown).toContain("# Hyperbolic Metric Space");
    expect(data.markdown).toContain("mutable struct TrieNode");
    expect(data.telemetry.tokensSaved).toBeGreaterThan(0);
    expect(res.headers.get("X-Orcein-Tokens-Saved")).toBeDefined();
  });

  it("POST /v1/digest supports raw text/markdown output format", async () => {
    const htmlPayload = "<html><body><h1>Quick Test</h1><p>Returning pure markdown for agent consumers.</p></body></html>";
    const res = await app.request("/v1/digest?format=markdown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: htmlPayload })
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("text/plain");
    const text = await res.text();
    expect(text).toContain("# Quick Test");
    expect(text).toContain("Returning pure markdown for agent consumers.");
  });

  it("POST /v1/webhooks/stripe provisions API key on checkout.session.completed", async () => {
    const mockStripeEvent = {
      type: "checkout.session.completed",
      data: {
        object: {
          customer_details: { email: "founder@example.com" },
          amount_total: 999
        }
      }
    };

    const res = await app.request("/v1/webhooks/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockStripeEvent)
    });

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.success).toBe(true);
    expect(body.email).toBe("founder@example.com");
    expect(body.tier).toBe("starter");
    expect(body.apiKey).toMatch(/^orcein_live_[0-9a-f]{48}$/);
  });

  it("verifies Stripe cryptographic webhook signatures and blocks spoofing", async () => {
    const secret = "whsec_test_secret_key";
    const rawBody = JSON.stringify({ test: "data" });
    const timestamp = Math.floor(Date.now() / 1000);
    const payload = `${timestamp}.${rawBody}`;
    
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const sigBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const validSigHex = Array.from(new Uint8Array(sigBytes))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    const validHeader = `t=${timestamp},v1=${validSigHex}`;
    const isValid = await verifyStripeSignature(rawBody, validHeader, secret);
    expect(isValid).toBe(true);

    // Spoofed signature
    const invalidHeader = `t=${timestamp},v1=deadbeef1234567890`;
    const isInvalid = await verifyStripeSignature(rawBody, invalidHeader, secret);
    expect(isInvalid).toBe(false);

    // Replay attack (> 300s old)
    const oldTimestamp = timestamp - 400;
    const oldHeader = `t=${oldTimestamp},v1=${validSigHex}`;
    const isReplay = await verifyStripeSignature(rawBody, oldHeader, secret);
    expect(isReplay).toBe(false);
  });
});
