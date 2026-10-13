import Stripe from "stripe";
import { NextResponse } from "next/server";
import { liveCheckoutEnabled, verifiedLiveStripe } from "@/lib/checkout/live";
import { fulfillLiveOrder } from "@/lib/checkout/live-fulfillment";
export const maxDuration = 60;
export async function POST(request: Request) {
  const secret = process.env.STRIPE_LIVE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return new NextResponse(null, { status: 400 });
  let event: Stripe.Event;
  try { event = Stripe.webhooks.constructEvent(await request.text(), signature, secret); }
  catch { return new NextResponse(null, { status: 400 }); }
  if (!event.livemode || !["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) return NextResponse.json({ received: true });
  const session = event.data.object as Stripe.Checkout.Session;
  if (!session.livemode || session.payment_status !== "paid" || session.metadata?.brand !== "modern-relic" || session.metadata?.sandbox !== "false") return NextResponse.json({ received: true });
  if (!liveCheckoutEnabled()) return new NextResponse(null, { status: 503 });
  try {
    const order = await fulfillLiveOrder(await verifiedLiveStripe(), session.id);
    console.info("Modern Relic paid order accepted", { orderId: order.id, reused: order.reused, status: order.status });
    return NextResponse.json({ received: true });
  } catch {
    console.error("Modern Relic paid order needs retry or review", { sessionId: session.id });
    return NextResponse.json({ error: "Order processing will be retried" }, { status: 500 });
  }
}
