import { createHash } from "node:crypto";
import { z } from "zod";
import { NextResponse } from "next/server";
import { buildQuote, publicQuote, quoteInputSchema } from "@/lib/checkout/quote";
import { LIVE_ORIGIN, liveCheckoutEnabled, liveOrigin, verifiedLiveStripe } from "@/lib/checkout/live";
const schema = quoteInputSchema.extend({ approvedTotalCents: z.number().int().positive(), attemptId: z.string().uuid() }).strict();
export const maxDuration = 60;
export async function POST(request: Request) {
  if (!liveCheckoutEnabled()) return new NextResponse(null, { status: 404 });
  if (!liveOrigin(request)) return new NextResponse(null, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 8000) throw new Error("Request too large");
    const parsed = schema.safeParse(JSON.parse(text));
    if (!parsed.success) return NextResponse.json({ error: "Check your address and order." }, { status: 400 });
    const stripe = await verifiedLiveStripe();
    const { approvedTotalCents, attemptId, ...input } = parsed.data;
    const q = await buildQuote(input, true);
    if (q.totalCents !== approvedTotalCents) return NextResponse.json({ error: "The quote changed. Review the updated total.", quote: publicQuote(q) }, { status: 409 });
    const r = input.recipient;
    const session = await stripe.checkout.sessions.create({
      mode: "payment", integration_identifier: `modern_relic_${createHash("sha256").update(attemptId).digest("hex").replace(/[0-9]/g, "a").slice(0, 8)}`,
      excluded_payment_method_types: ["klarna", "affirm", "afterpay_clearpay", "paypal"],
      billing_address_collection: "required",
      line_items: [{ quantity: 1, price_data: { currency: "usd", unit_amount: q.totalCents, product_data: {
        name: `${q.quantity} × ${q.name}`, description: `Shipping included. Ship to: ${r.name}, ${r.address1}, ${r.address2}, ${r.city}, ${r.state_code} ${r.zip}.`,
      }}}],
      success_url: `${LIVE_ORIGIN}/shop/checkout/complete`, cancel_url: `${LIVE_ORIGIN}/shop/checkout?variant=${q.variantId}`,
      custom_text: { submit: { message: "Your order will ship to the address shown above. Return to Modern Relic before paying if you need to change it." } },
      metadata: { brand: "modern-relic", sandbox: "false", expected_total: String(q.totalCents), variant_id: String(q.variantId), quantity: String(q.quantity),
        recipient_name: r.name, address1: r.address1, address2: r.address2, city: r.city, state: r.state_code, country: r.country_code, zip: r.zip,
        print_file_ids: q.printFileIds.sort((a, b) => a - b).join(","), supplier_total: String(q.supplierTotalCents), shipping_cost: String(q.shippingCents),
      },
    }, { idempotencyKey: `mr-live-${attemptId}` });
    if (!session.livemode || !session.url?.startsWith("https://checkout.stripe.com/")) throw new Error("Invalid session");
    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 }); }
}
