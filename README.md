# Orcein Labs Edge API (`api.orceinlabs.com`)

High-performance, edge-accelerated developer APIs and autonomous agent tools powered by Cloudflare Workers and Stripe.

---

## ⚡ Live Endpoints

### 1. `GET | POST /v1/digest` — Agent Context Digest API
Extracts, strips boilerplate, and minifies web pages, articles, and documentation into dense, token-budgeted GitHub-Flavored Markdown for LLMs and autonomous agents.

#### Quick Query (JSON):
```bash
curl -X GET "https://api.orceinlabs.com/v1/digest?url=https://github.com/Orcein-Labs/Palette"
```

#### Raw Markdown Output (Direct Agent Consumption):
```bash
curl -X GET "https://api.orceinlabs.com/v1/digest?url=https://docs.stripe.com&format=markdown"
```

#### POST with Token Budgeting (`max_tokens`):
```bash
curl -X POST "https://api.orceinlabs.com/v1/digest" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer orcein_live_YOUR_KEY" \
  -d '{
    "url": "https://en.wikipedia.org/wiki/Hyperbolic_geometry",
    "max_tokens": 1500,
    "preserve_links": true
  }'
```

#### Response Payload:
```json
{
  "title": "Hyperbolic geometry - Wikipedia",
  "url": "https://en.wikipedia.org/wiki/Hyperbolic_geometry",
  "markdown": "# Hyperbolic geometry\n\nIn mathematics, hyperbolic geometry...",
  "telemetry": {
    "originalBytes": 346219,
    "digestBytes": 96372,
    "compressionPercent": 72.2,
    "estimatedTokens": 25362,
    "tokensSaved": 65749,
    "elapsedMs": 4.8,
    "tier": "starter"
  }
}
```

---

## 💳 Automated Monetization & Stripe Webhook

### Route: `POST /v1/webhooks/stripe`
Listens for `checkout.session.completed` events:
- Automatically provisions a cryptographically secure `orcein_live_<hex>` API key.
- Dumps key record into Cloudflare KV (`ORCEIN_KEYS`) with quota balance.
- Returns key metadata for instant delivery to the customer.

| Plan | Price | Monthly Quota | Features |
| :--- | :--- | :--- | :--- |
| **Free Tier** | $0 | 5 requests / hour | IP-metered, 1h cache |
| **Starter** | $9.99 / mo | 10,000 requests | Full API access, 5ms edge cache |
| **Pro** | $49.00 / mo | 100,000 requests | Priority routing, custom `max_tokens` |
| **Enterprise** | $199.00 / mo | 1,000,000 requests | Dedicated KV aperture |

---

## 🛠️ Architecture & Performance

- **Runtime:** Cloudflare Workers (`workerd` V8 engine, ~5ms startup).
- **Edge KV:** Dual-namespace architecture (`ORCEIN_KEYS` for auth/metering, `ORCEIN_CACHE` for 1-hour global edge response caching).
- **Parser Engine:** Zero-dependency, streaming DOM stripper and Markdown table synthesizer.
- **Test Suite:** 100% green unit and integration tests executed in < 60ms under Bun test runner.

---

## 🧪 Development & Deployment

```bash
# Run unit & integration tests
bun test

# Type check
bunx tsc --noEmit

# Deploy to Cloudflare Edge
export CLOUDFLARE_API_TOKEN="..."
wrangler deploy
```

---

## License
MIT © 2026 Orcein Labs.
