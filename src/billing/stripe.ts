/**
 * Orcein Stripe Webhook & Automated Key Provisioning Handler
 */

import { generateApiKey, type KeyRecord } from "../auth/keys";

export interface StripeWebhookEnv {
  ORCEIN_KEYS?: KVNamespace;
  STRIPE_WEBHOOK_SECRET?: string;
}

export async function handleStripeWebhook(
  request: Request,
  env: StripeWebhookEnv
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let event: any;
  try {
    const rawBody = await request.text();
    event = JSON.parse(rawBody);
  } catch (err: any) {
    return new Response(`Webhook JSON error: ${err.message}`, { status: 400 });
  }

  // Handle successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data?.object;
    if (!session) {
      return new Response("Missing session payload", { status: 400 });
    }

    const email = session.customer_details?.email || session.customer_email || "customer@orceinlabs.com";
    const amountTotal = session.amount_total || 999; // Default cents ($9.99)

    // Determine tier based on checkout amount
    let tier: KeyRecord["tier"] = "starter";
    let credits = 10000;

    if (amountTotal >= 4900) {
      tier = "pro";
      credits = 100000;
    } else if (amountTotal >= 19900) {
      tier = "enterprise";
      credits = 1000000;
    }

    const apiKey = generateApiKey(true);
    const keyRecord: KeyRecord = {
      id: crypto.randomUUID(),
      key: apiKey,
      tier,
      email,
      createdAt: Date.now(),
      creditsTotal: credits,
      creditsRemaining: credits,
      status: "active"
    };

    if (env?.ORCEIN_KEYS) {
      // Store key record and email pointer in KV
      await env.ORCEIN_KEYS.put(`key:${apiKey}`, JSON.stringify(keyRecord));
      await env.ORCEIN_KEYS.put(`customer:${email}`, apiKey);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "API key provisioned successfully",
        email,
        tier,
        credits,
        apiKey
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
