import { describe, it, expect } from "bun:test";
import app from "../src/index";

describe("Orcein Edge API Router Integration", () => {
  it("GET / returns service manifest and endpoints", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.service).toBe("Orcein Labs Core Edge API");
    expect(body.endpoints.digest).toBeDefined();
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
});
