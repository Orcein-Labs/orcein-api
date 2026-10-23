/**
 * Orcein Labs - Official Landing Page & Interactive Playground
 */

export function getLandingPageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orcein Labs | High-Performance Edge Primitives for AI Agents</title>
  <meta name="description" content="Orcein Labs builds edge-accelerated infrastructure, context extractors, and swarm coordination protocols for autonomous engineering agents.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔮</text></svg>">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#f5f3ff',
              100: '#ede9fe',
              400: '#a78bfa',
              500: '#8b5cf6',
              600: '#7c3aed',
              700: '#6d28d9',
              900: '#4c1d95',
            }
          }
        }
      }
    }
  </script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #09090b;
      color: #f4f4f5;
    }
    code, pre, .font-mono {
      font-family: 'JetBrains Mono', monospace;
    }
    .gradient-text {
      background: linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .glow-card {
      background: radial-gradient(1000px circle at top left, rgba(139, 92, 246, 0.08), transparent 40%), #121216;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .glow-card:hover {
      border-color: rgba(168, 85, 247, 0.3);
    }
  </style>
</head>
<body class="min-h-screen flex flex-col antialiased selection:bg-purple-900 selection:text-white">

  <!-- Navigation -->
  <nav class="sticky top-0 z-50 backdrop-blur-md bg-[#09090b]/80 border-b border-zinc-800/80 px-6 py-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span class="text-white font-black text-lg">O</span>
        </div>
        <div>
          <span class="text-lg font-bold tracking-tight text-white">Orcein Labs</span>
          <span class="ml-2 text-[10px] font-mono tracking-widest uppercase bg-purple-950/80 text-purple-300 border border-purple-800/50 px-2 py-0.5 rounded-full">Edge AI</span>
        </div>
      </div>
      <div class="hidden md:flex items-center space-x-6 text-sm text-zinc-400">
        <a href="#playground" class="hover:text-white transition">Live Demo</a>
        <a href="#products" class="hover:text-white transition">Products</a>
        <a href="#pricing" class="hover:text-white transition">Pricing</a>
        <a href="#docs" class="hover:text-white transition">Documentation</a>
      </div>
      <div>
        <a href="https://buy.stripe.com/cNi9AL4ef1fp7TRb3XaAw00" target="_blank" class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 transition transform hover:-translate-y-0.5">
          Get API Key ($9.99/mo)
        </a>
      </div>
    </div>
  </nav>

  <!-- Hero Section -->
  <main class="flex-1">
    <section class="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
      <div class="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-mono mb-8">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Context Digest API v1.0 is Live on Cloudflare Edge</span>
      </div>
      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
        Zero-bloat web context for <br>
        <span class="gradient-text">Autonomous AI Agents</span>
      </h1>
      <p class="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
        Extract clean, semantic Markdown from arbitrary web pages and repositories in <strong class="text-zinc-200">5ms</strong>. Strip 70–85% of boilerplate HTML and save tens of thousands of LLM context tokens per request.
      </p>

      <div class="mt-8 flex flex-wrap justify-center gap-4">
        <a href="https://buy.stripe.com/cNi9AL4ef1fp7TRb3XaAw00" target="_blank" class="px-6 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30 transition transform hover:-translate-y-0.5">
          Start for $9.99 / month &rarr;
        </a>
        <a href="#playground" class="px-6 py-3.5 text-base font-semibold text-zinc-300 bg-zinc-900 border border-zinc-700/80 rounded-xl hover:bg-zinc-800 hover:text-white transition">
          Test Live Playground
        </a>
      </div>
    </section>

    <!-- Interactive Live Playground -->
    <section id="playground" class="max-w-5xl mx-auto px-6 py-8">
      <div class="glow-card rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-800 gap-3">
          <div>
            <h2 class="text-xl font-bold text-white flex items-center space-x-2">
              <span>⚡ Live Edge Playground</span>
              <span class="text-xs font-normal font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">Free Tier (5 req/hr)</span>
            </h2>
            <p class="text-xs text-zinc-400 mt-1">Directly call our live Cloudflare Worker endpoint to see token reduction in action.</p>
          </div>
          <div class="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
            <span>● 330+ Edge Cities</span>
          </div>
        </div>

        <!-- Input Bar -->
        <div class="mt-6 flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <input 
              id="target-url" 
              type="url" 
              value="https://github.com/Orcein-Labs/Palette" 
              placeholder="https://example.com/article" 
              class="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
            >
          </div>
          <button 
            id="extract-btn" 
            onclick="runExtractor()" 
            class="px-6 py-3 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 active:bg-purple-700 rounded-xl shadow-md shadow-purple-600/30 transition flex items-center justify-center space-x-2"
          >
            <span id="btn-spinner" class="hidden animate-spin">⏳</span>
            <span id="btn-label">Extract & Minify</span>
          </button>
        </div>

        <!-- Metrics Dashboard -->
        <div id="metrics-bar" class="hidden mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 text-center">
            <div class="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Original Size</div>
            <div id="stat-orig" class="text-lg font-bold font-mono text-zinc-300 mt-1">-</div>
          </div>
          <div class="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 text-center">
            <div class="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Clean Markdown</div>
            <div id="stat-clean" class="text-lg font-bold font-mono text-purple-400 mt-1">-</div>
          </div>
          <div class="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 text-center">
            <div class="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Token Reduction</div>
            <div id="stat-reduction" class="text-lg font-bold font-mono text-emerald-400 mt-1">-</div>
          </div>
          <div class="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 text-center">
            <div class="text-[11px] font-mono uppercase tracking-wider text-zinc-400">Edge Latency</div>
            <div id="stat-latency" class="text-lg font-bold font-mono text-sky-400 mt-1">-</div>
          </div>
        </div>

        <!-- Output Box -->
        <div class="mt-6">
          <div class="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
            <span>Result (Markdown)</span>
            <span id="cache-status" class="text-purple-400"></span>
          </div>
          <pre id="output-box" class="w-full h-64 bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 text-xs font-mono text-zinc-300 overflow-y-auto whitespace-pre-wrap">Click "Extract & Minify" to test our live edge worker on https://github.com/Orcein-Labs/Palette...</pre>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="max-w-5xl mx-auto px-6 py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-extrabold text-white">Transparent, Developer-First Pricing</h2>
        <p class="text-zinc-400 mt-2">Zero hidden fees. Unlimited edge acceleration. Upgrade or cancel anytime.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <!-- Free Tier -->
        <div class="bg-[#121216] border border-zinc-800 rounded-2xl p-8 flex flex-col justify-between">
          <div>
            <div class="text-sm font-mono uppercase tracking-wider text-zinc-400">Community</div>
            <h3 class="text-2xl font-bold text-white mt-1">Free Tier</h3>
            <div class="mt-4 flex items-baseline">
              <span class="text-4xl font-extrabold text-white">$0</span>
              <span class="text-zinc-400 ml-2">/ month</span>
            </div>
            <p class="text-xs text-zinc-400 mt-3">Great for local debugging and quick tests.</p>
            <ul class="mt-6 space-y-3 text-sm text-zinc-300">
              <li class="flex items-center"><span class="text-emerald-400 mr-2">✓</span> 5 requests per hour (IP rate limited)</li>
              <li class="flex items-center"><span class="text-emerald-400 mr-2">✓</span> Standard Markdown extraction</li>
              <li class="flex items-center"><span class="text-emerald-400 mr-2">✓</span> Global edge routing</li>
            </ul>
          </div>
          <div class="mt-8">
            <a href="#playground" class="w-full block text-center py-3 font-semibold text-zinc-300 bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 rounded-xl transition">
              Use Free in Playground
            </a>
          </div>
        </div>

        <!-- Starter Plan (Featured) -->
        <div class="relative bg-gradient-to-b from-purple-950/30 to-[#121216] border-2 border-purple-500/80 rounded-2xl p-8 flex flex-col justify-between shadow-2xl shadow-purple-950/50">
          <div class="absolute -top-3.5 right-6 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full text-[11px] font-bold text-white tracking-wide uppercase shadow">
            Most Popular
          </div>
          <div>
            <div class="text-sm font-mono uppercase tracking-wider text-purple-400">Production</div>
            <h3 class="text-2xl font-bold text-white mt-1">Context Digest Starter</h3>
            <div class="mt-4 flex items-baseline">
              <span class="text-4xl font-extrabold text-white">$9.99</span>
              <span class="text-zinc-400 ml-2">/ month</span>
            </div>
            <p class="text-xs text-purple-300/80 mt-3">For Claude Code, Cursor, auto-scrapers, and AI agents.</p>
            <ul class="mt-6 space-y-3 text-sm text-zinc-200">
              <li class="flex items-center"><span class="text-purple-400 mr-2">✓</span> <strong>50,000 extractions</strong> per month</li>
              <li class="flex items-center"><span class="text-purple-400 mr-2">✓</span> Instant API key delivered upon checkout</li>
              <li class="flex items-center"><span class="text-purple-400 mr-2">✓</span> <strong>Edge KV Cache</strong> (sub-5ms hit latency)</li>
              <li class="flex items-center"><span class="text-purple-400 mr-2">✓</span> Token Minifier (70-85% reduction)</li>
              <li class="flex items-center"><span class="text-purple-400 mr-2">✓</span> No rate limiting throttles</li>
              <li class="flex items-center"><span class="text-purple-400 mr-2">✓</span> Priority email support (contact@orceinlabs.com)</li>
            </ul>
          </div>
          <div class="mt-8">
            <a href="https://buy.stripe.com/cNi9AL4ef1fp7TRb3XaAw00" target="_blank" class="w-full block text-center py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-purple-600/40 transition transform hover:-translate-y-0.5">
              Subscribe Now &rarr;
            </a>
            <div class="text-[11px] text-zinc-400 text-center mt-2">Secured by Stripe • Instant cancellation anytime</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Developer Quickstart Docs -->
    <section id="docs" class="max-w-5xl mx-auto px-6 py-12">
      <div class="glow-card rounded-2xl p-8">
        <h2 class="text-2xl font-bold text-white mb-4">Developer Quickstart</h2>
        <p class="text-sm text-zinc-400 mb-6">Integrate into your agentic stack in 2 lines of code.</p>

        <div class="space-y-6">
          <div>
            <div class="text-xs font-mono text-purple-400 uppercase tracking-wider mb-2">cURL</div>
            <pre class="bg-zinc-950 p-4 rounded-xl text-xs font-mono text-zinc-300 border border-zinc-800 overflow-x-auto">curl -H "Authorization: Bearer orcein_live_YOUR_KEY" \\
  "https://api.orceinlabs.com/v1/digest?url=https://github.com/Orcein-Labs/Palette"</pre>
          </div>

          <div>
            <div class="text-xs font-mono text-purple-400 uppercase tracking-wider mb-2">Python (httpx)</div>
            <pre class="bg-zinc-950 p-4 rounded-xl text-xs font-mono text-zinc-300 border border-zinc-800 overflow-x-auto">import httpx

res = httpx.get(
    "https://api.orceinlabs.com/v1/digest",
    params={"url": "https://github.com/Orcein-Labs/Palette"},
    headers={"Authorization": "Bearer orcein_live_YOUR_KEY"}
)
digest = res.json()
print(f"Saved {digest['metrics']['tokensSaved']} tokens! Latency: {digest['metrics']['edgeLatencyMs']}ms")
print(digest["markdown"])</pre>
          </div>
        </div>
      </div>
    </section>

    <!-- Lab Products Portfolio -->
    <section id="products" class="max-w-5xl mx-auto px-6 py-12">
      <h2 class="text-2xl font-bold text-white mb-6">The Orcein Labs Ecosystem</h2>
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-[#121216] border border-zinc-800 rounded-xl p-6">
          <div class="text-xs font-mono text-purple-400 mb-1">Live Product</div>
          <h3 class="text-lg font-bold text-white">Context Digest API</h3>
          <p class="text-xs text-zinc-400 mt-2">Zero-bloat web & document context minifier for LLMs. 70%+ token savings.</p>
        </div>
        <div class="bg-[#121216] border border-zinc-800 rounded-xl p-6">
          <div class="text-xs font-mono text-amber-400 mb-1">Active Beta</div>
          <h3 class="text-lg font-bold text-white">Tether Protocol</h3>
          <p class="text-xs text-zinc-400 mt-2">Decentralized state synchronization and lock leases for collaborative agent swarms.</p>
        </div>
        <div class="bg-[#121216] border border-zinc-800 rounded-xl p-6">
          <div class="text-xs font-mono text-sky-400 mb-1">Research Preview</div>
          <h3 class="text-lg font-bold text-white">NCD Hyperbolic Engine</h3>
          <p class="text-xs text-zinc-400 mt-2">5D Lorentz non-Euclidean vector search for hierarchical knowledge graphs.</p>
        </div>
      </div>
    </section>
  </main>

  <!-- Legal, Terms, & Compliance Footer -->
  <footer id="contact" class="bg-zinc-950 border-t border-zinc-900 py-12 px-6 text-zinc-400 text-xs">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div class="flex items-center space-x-2 text-white font-bold text-base mb-3">
          <div class="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-xs">O</div>
          <span>Orcein Labs</span>
        </div>
        <p class="text-zinc-500 leading-relaxed">
          High-performance edge systems and autonomous engineering intelligence.
        </p>
        <p class="mt-4 text-zinc-500">© 2026 Orcein Labs. All rights reserved.</p>
      </div>

      <div>
        <div class="font-semibold text-zinc-200 mb-3 uppercase tracking-wider text-[11px] font-mono">Products</div>
        <ul class="space-y-2">
          <li><a href="#playground" class="hover:text-white transition">Context Digest API</a></li>
          <li><a href="https://github.com/Orcein-Labs/Palette" target="_blank" class="hover:text-white transition">Palette Framework</a></li>
          <li><a href="https://github.com/Orcein-Labs" target="_blank" class="hover:text-white transition">GitHub Organization</a></li>
        </ul>
      </div>

      <div>
        <div class="font-semibold text-zinc-200 mb-3 uppercase tracking-wider text-[11px] font-mono">Contact & Support</div>
        <ul class="space-y-2">
          <li>Email: <a href="mailto:contact@orceinlabs.com" class="text-purple-400 hover:underline">contact@orceinlabs.com</a></li>
          <li>Developer: <a href="mailto:matt@orceinlabs.com" class="hover:text-white transition">matt@orceinlabs.com</a></li>
          <li>Support hours: 24/7 edge uptime monitoring</li>
        </ul>
      </div>

      <div>
        <div class="font-semibold text-zinc-200 mb-3 uppercase tracking-wider text-[11px] font-mono">Legal & Policies</div>
        <ul class="space-y-2">
          <li><a href="#terms-modal" onclick="showLegal('terms')" class="hover:text-white transition">Terms of Service</a></li>
          <li><a href="#privacy-modal" onclick="showLegal('privacy')" class="hover:text-white transition">Privacy Policy</a></li>
          <li><a href="#refund-modal" onclick="showLegal('refund')" class="hover:text-white transition">Refund & Cancellation Policy</a></li>
        </ul>
      </div>
    </div>
  </footer>

  <!-- Legal Modal Dialog -->
  <div id="legal-modal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-[#121216] border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 text-zinc-300 max-h-[85vh] flex flex-col">
      <div class="flex items-center justify-between pb-4 border-b border-zinc-800">
        <h3 id="legal-title" class="text-lg font-bold text-white">Legal Notice</h3>
        <button onclick="closeLegal()" class="text-zinc-400 hover:text-white text-xl">&times;</button>
      </div>
      <div id="legal-body" class="py-4 text-xs leading-relaxed overflow-y-auto space-y-3 font-normal text-zinc-400">
        <!-- Injected via JS -->
      </div>
      <div class="pt-4 border-t border-zinc-800 text-right">
        <button onclick="closeLegal()" class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold">Close</button>
      </div>
    </div>
  </div>

  <script>
    async function runExtractor() {
      const urlInput = document.getElementById('target-url');
      const btn = document.getElementById('extract-btn');
      const btnLabel = document.getElementById('btn-label');
      const spinner = document.getElementById('btn-spinner');
      const output = document.getElementById('output-box');
      const metricsBar = document.getElementById('metrics-bar');
      const cacheStatus = document.getElementById('cache-status');

      const targetUrl = urlInput.value.trim();
      if (!targetUrl) return;

      btn.disabled = true;
      spinner.classList.remove('hidden');
      btnLabel.innerText = "Processing...";
      output.innerText = "Fetching and extracting clean markdown at edge...";

      const startTime = performance.now();

      try {
        const response = await fetch('/v1/digest?url=' + encodeURIComponent(targetUrl));
        const data = await response.json();
        const clientLatency = Math.round(performance.now() - startTime);

        if (!response.ok) {
          output.innerText = "Error " + response.status + ": " + (data.error || "Failed to digest URL.");
          return;
        }

        output.innerText = data.markdown || "(No content extracted)";
        metricsBar.classList.remove('hidden');

        document.getElementById('stat-orig').innerText = (data.metrics?.rawBytes ? (data.metrics.rawBytes / 1024).toFixed(1) + ' KB' : 'N/A');
        document.getElementById('stat-clean').innerText = (data.metrics?.markdownBytes ? (data.metrics.markdownBytes / 1024).toFixed(1) + ' KB' : 'N/A');
        document.getElementById('stat-reduction').innerText = (data.metrics?.reductionRatio ? data.metrics.reductionRatio : 'N/A');
        document.getElementById('stat-latency').innerText = (data.metrics?.edgeLatencyMs ? data.metrics.edgeLatencyMs + 'ms' : clientLatency + 'ms');

        const hit = response.headers.get('X-Orcein-Cache');
        cacheStatus.innerText = hit === 'HIT' ? '⚡ Edge Cache HIT' : '🌐 Live Edge Parsed';
      } catch (err) {
        output.innerText = "Network Error: " + err.message;
      } finally {
        btn.disabled = false;
        spinner.classList.add('hidden');
        btnLabel.innerText = "Extract & Minify";
      }
    }

    const LEGAL_TEXTS = {
      terms: "<strong>Terms of Service - Orcein Labs</strong><br><br>By using Orcein Labs services (including the Context Digest API), you agree to comply with all applicable laws and respect upstream website terms and robots.txt protocols. Services are provided on an 'as-is' basis. Orcein Labs reserves the right to rate limit or suspend access in the event of abusive traffic or automated denial-of-service attempts.",
      privacy: "<strong>Privacy Policy - Orcein Labs</strong><br><br>Orcein Labs respects your privacy. We do not sell your personal data or query payloads to third parties. API usage metrics and transient IP records are retained solely for rate limiting, DDoS mitigation, and billing validation. Payments are securely processed directly by Stripe; Orcein Labs does not store credit card or sensitive financial information.",
      refund: "<strong>Refund & Cancellation Policy - Orcein Labs</strong><br><br>Subscriptions can be canceled at any time with one click through your Stripe Customer Portal. If you are unsatisfied with our API service, you may request a full refund within 7 days of initial purchase by contacting contact@orceinlabs.com."
    };

    function showLegal(type) {
      document.getElementById('legal-title').innerText = type.toUpperCase() + " - ORCEIN LABS";
      document.getElementById('legal-body').innerHTML = LEGAL_TEXTS[type] || "";
      document.getElementById('legal-modal').classList.remove('hidden');
    }

    function closeLegal() {
      document.getElementById('legal-modal').classList.add('hidden');
    }
  </script>
</body>
</html>`;
}
