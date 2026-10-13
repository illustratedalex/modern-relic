import { createHash } from "node:crypto";
import { z } from "zod";
import { NextResponse } from "next/server";
import { buildQuote, publicQuote, quoteInputSchema } from "@/lib/checkout/quote";
import { CHECKOUT_ORIGIN, sameCheckoutOrigin, verifiedSandboxStripe } from "@/lib/checkout/sandbox";
const schema = quoteInputSchema.extend({ approvedTotalCents: z.number().int().positive(), attemptId: z.string().uuid() }).strict();
export const maxDuration = 60;
export async function POST(request: Request) {
  if (process.env.VERCEL_ENV !== "preview") return new NextResponse(null, { status: 404 });
  if (!sameCheckoutOrigin(request)) return NextResponse.json({ error: "Request unavailable" }, { status: 403 });
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 8000) throw new Error("Request too large");
    const text = await request.text();
    if (text.length > 8000) throw new Error("Request too large");
    const parsed = schema.safeParse(JSON.parse(text));
    if (!parsed.success) return NextResponse.json({ error: "Check your address and order." }, { status: 400 });
    if (!process.env.STRIPE_TEST_WEBHOOK_SECRET) throw new Error("Webhook not configured");
    const stripe = await verifiedSandboxStripe();
    const { approvedTotalCents, attemptId, ...input } = parsed.data;
    const q = await buildQuote(input);
    if (q.totalCents !== approvedTotalCents) return NextResponse.json({ error: "The quote changed. Review the updated total.", quote: publicQuote(q) }, { status: 409 });
    const r = input.recipient;
    const session = await stripe.checkout.sessions.create({
      mode: "payment", integration_identifier: `modern_relic_${createHash("sha256").update(attemptId).digest("hex").replace(/[0-9]/g,"a").slice(0,8)}`,
      line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: q.totalCents, product_data: {
        name: `${q.quantity} × ${q.name}`, description: `Test order. Shipping included. Ship to: ${r.name}, ${r.address1}, ${r.address2}, ${r.city}, ${r.state_code} ${r.zip}.`,
      }}}],
      success_url: `${CHECKOUT_ORIGIN}/shop/checkout/complete`, cancel_url: `${CHECKOUT_ORIGIN}/shop/checkout?variant=${q.variantId}`,
      custom_text: { submit: { message: "Sandbox test only. No real charge or shipment. Shipping address is the one shown above." } },
      metadata: { brand: "modern-relic", sandbox: "true", expected_total: String(q.totalCents), variant_id: String(q.variantId), quantity: String(q.quantity),
        recipient_name: r.name, address1: r.address1, address2: r.address2, city: r.city, state: r.state_code, country: r.country_code, zip: r.zip,
        print_file_ids: q.printFileIds.sort((a,b)=>a-b).join(","), supplier_total: String(q.supplierTotalCents), shipping_cost: String(q.shippingCents),
      },
    }, { idempotencyKey: `mr-sandbox-${attemptId}` });
    if (session.livemode || !session.url?.startsWith("https://checkout.stripe.com/")) throw new Error("Invalid checkout session");
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Test checkout is temporarily unavailable." }, { status: 503 }); }
}
