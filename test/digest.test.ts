import { describe, it, expect } from "bun:test";
import { extractMarkdown, estimateTokens, extractTitle } from "../src/digest/extractor";

describe("Orcein Context Digest Engine", () => {
  it("extracts page title correctly from <title> or <h1>", () => {
    const html1 = "<html><head><title>Stripe API Reference - Charges</title></head><body></body></html>";
    expect(extractTitle(html1)).toBe("Stripe API Reference - Charges");

    const html2 = "<html><body><h1>Cloudflare Workers Quickstart</h1></body></html>";
    expect(extractTitle(html2)).toBe("Cloudflare Workers Quickstart");
  });

  it("strips junk tags (scripts, styles, nav, footer, SVGs, modals)", () => {
    const rawHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Developer Docs</title>
          <style>body { font-size: 14px; } .cookie { display: none; }</style>
          <script>console.log("tracking pixel");</script>
        </head>
        <body>
          <nav><a href="/home">Home</a><a href="/pricing">Pricing</a></nav>
          <div aria-hidden="true">Cookie Consent Banner: Accept All</div>
          <main>
            <h1>Getting Started</h1>
            <p>Welcome to the <strong>Orcein Labs</strong> API documentation.</p>
          </main>
          <footer>Copyright 2026 Orcein Labs. All rights reserved.</footer>
        </body>
      </html>
    `;

    const result = extractMarkdown(rawHtml);
    expect(result.title).toBe("Developer Docs");
    expect(result.markdown).toContain("# Getting Started");
    expect(result.markdown).toContain("Welcome to the **Orcein Labs** API documentation.");
    expect(result.markdown).not.toContain("tracking pixel");
    expect(result.markdown).not.toContain("Cookie Consent Banner");
    expect(result.markdown).not.toContain("font-size: 14px");
    expect(result.markdown).not.toContain("Copyright 2026");
    expect(result.metadata.compressionPercent).toBeGreaterThan(30);
  });

  it("preserves code blocks and inline code faithfully", () => {
    const rawHtml = `
      <html>
        <body>
          <h2>Usage Example</h2>
          <p>Run the command <code>bun run dev</code> in your terminal:</p>
          <pre><code class="language-typescript">
import { Hono } from "hono";
const app = new Hono();
app.get("/health", (c) => c.text("ok"));
export default app;
          </code></pre>
        </body>
      </html>
    `;

    const result = extractMarkdown(rawHtml);
    expect(result.markdown).toContain("## Usage Example");
    expect(result.markdown).toContain("`bun run dev`");
    expect(result.markdown).toContain("```typescript");
    expect(result.markdown).toContain('const app = new Hono();');
    expect(result.markdown).toContain("```");
  });

  it("converts HTML tables into clean GFM Markdown tables", () => {
    const rawHtml = `
      <html>
        <body>
          <h2>Model Benchmark Results</h2>
          <table>
            <thead>
              <tr><th>Model</th><th>Latency</th><th>Tokens/sec</th></tr>
            </thead>
            <tbody>
              <tr><td>Spark-X26</td><td>18ms</td><td>142.5</td></tr>
              <tr><td>Baseline</td><td>85ms</td><td>31.0</td></tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    const result = extractMarkdown(rawHtml);
    expect(result.markdown).toContain("| Model | Latency | Tokens/sec |");
    expect(result.markdown).toContain("| --- | --- | --- |");
    expect(result.markdown).toContain("| Spark-X26 | 18ms | 142.5 |");
    expect(result.markdown).toContain("| Baseline | 85ms | 31.0 |");
  });

  it("enforces maxTokens budget when requested", () => {
    const rawHtml = `
      <html>
        <body>
          <h1>Extensive Research Paper</h1>
          <p>${"This is paragraph one of the extensive research paper on hyperbolic manifolds. ".repeat(20)}</p>
          <p>${"This is paragraph two detailing the Lyapunov descent algorithm and contraction metrics. ".repeat(20)}</p>
          <p>${"This is paragraph three covering synthetic benchmarks and memory layouts. ".repeat(20)}</p>
        </body>
      </html>
    `;

    const fullResult = extractMarkdown(rawHtml);
    const cappedResult = extractMarkdown(rawHtml, { maxTokens: 50 });

    expect(cappedResult.metadata.estimatedTokens).toBeLessThanOrEqual(60);
    expect(cappedResult.markdown).toContain("[... Truncated at budget: 50 tokens ...]");
    expect(cappedResult.markdown.length).toBeLessThan(fullResult.markdown.length);
  });

  it("handles adversarial inputs: unclosed tags, unicode, emojis, and raw text safely", () => {
    // Unclosed tags gracefully extract readable text without throwing
    const unclosed = "<div><h3>Unclosed Header</h3><p>Paragraph without closing tags<b>Bold text</b><i>Italic</i>";
    const res1 = extractMarkdown(unclosed);
    expect(res1.markdown).toContain("### Unclosed Header");
    expect(res1.markdown).toContain("**Bold text**");
    expect(res1.markdown).toContain("*Italic*");

    // Multilingual & Unicode & Emojis
    const unicode = "<html><body><h1>自然言語処理 🚀</h1><p>オルセイン・ラボへようこそ！ ⚡</p></body></html>";
    const res2 = extractMarkdown(unicode);
    expect(res2.markdown).toContain("# 自然言語処理 🚀");
    expect(res2.markdown).toContain("オルセイン・ラボへようこそ！ ⚡");

    // Empty string
    const empty = extractMarkdown("");
    expect(empty.markdown).toBe("");
    expect(empty.metadata.digestBytes).toBe(0);
  });
});
