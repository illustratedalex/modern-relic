import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createPaidDraft } from "@/lib/checkout/fulfillment";
export const maxDuration = 60;
// Public receiver for the separate sandbox account. Signature validation grants access only to that endpoint's events.
// No production Stripe API key, real payment, or Printful confirmation is used here.
export async function POST(request: Request) {
  const secret = process.env.STRIPE_TEST_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  let event: Stripe.Event;
  try { event = Stripe.webhooks.constructEvent(await request.text(), signature, secret); }
  catch { return NextResponse.json({ error: "Invalid webhook" }, { status: 400 }); }
  if (event.livemode || !["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) return NextResponse.json({ received: true });
  const session = event.data.object as Stripe.Checkout.Session;
  if (session.livemode || session.payment_status !== "paid" || session.metadata?.brand !== "modern-relic") return NextResponse.json({ received: true });
  try {
    const draft = await createPaidDraft(session);
    console.info("Modern Relic sandbox draft verified", { draftId: draft.id, reused: draft.reused });
    return NextResponse.json({ received: true });
  } catch { return NextResponse.json({ error: "Draft creation will be retried" }, { status: 500 }); }
}
