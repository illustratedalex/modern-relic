import { createHash } from "node:crypto";
import type Stripe from "stripe";
import { printfulApi, quoteInputSchema, SupplierError, VERIFIED_VARIANTS, moneyCents } from "./quote";
import { livePrintItem } from "./print-item";
export function liveExternalId(sessionId: string) { return `mr-live-${createHash("sha256").update(sessionId).digest("hex").slice(0, 24)}`; }
export function livePaidInput(session: Stripe.Checkout.Session) {
  if (!session.livemode || session.payment_status !== "paid" || session.status !== "complete" || session.currency !== "usd"
    || session.metadata?.brand !== "modern-relic" || session.metadata?.sandbox !== "false"
    || !Number.isSafeInteger(session.amount_total) || !session.amount_total || session.amount_total !== Number(session.metadata?.expected_total)) throw new Error("Invalid paid live order");
  const m = session.metadata;
  const input = quoteInputSchema.parse({ variantId: Number(m.variant_id), quantity: Number(m.quantity), recipient: {
    name: m.recipient_name, address1: m.address1, address2: m.address2 ?? "", city: m.city, state_code: m.state, country_code: m.country, zip: m.zip,
  } });
  if (!VERIFIED_VARIANTS.has(input.variantId)) throw new Error("Unknown variant");
  return input;
}
export function verifyMargin(totalCents: number, feeCents: number, supplierCents: number, quantity: number) {
  if (![totalCents, feeCents, supplierCents, quantity].every(Number.isSafeInteger) || feeCents < 0 || supplierCents <= 0 || quantity < 1 || quantity > 10) throw new Error("Invalid costs");
  const margin = totalCents - feeCents - supplierCents;
  if (margin < quantity * 250 || margin > quantity * 500) throw new Error("Order margin needs review");
  return margin;
}
export async function fulfillLiveOrder(stripe: Stripe, sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent.latest_charge.balance_transaction"] });
  const input = livePaidInput(session);
  const intent = session.payment_intent as Stripe.PaymentIntent | null;
  const charge = intent?.latest_charge as Stripe.Charge | null;
  const balance = charge?.balance_transaction as Stripe.BalanceTransaction | null;
  if (!intent || intent.status !== "succeeded" || !charge || !charge.paid || !charge.captured || charge.refunded || charge.amount_refunded > 0 || charge.disputed || charge.amount !== session.amount_total
    || !balance || balance.currency !== "usd" || !Number.isSafeInteger(balance.fee)) throw new Error("Payment fee or status not ready");
  const external = liveExternalId(session.id);
  async function existing() {
    try { return await printfulApi(`/orders/@${external}`); }
    catch (e) { if (e instanceof SupplierError && e.status === 404) return null; throw e; }
  }
  let order = await existing();
  const accepted = new Set(["pending", "inprocess", "onhold", "partial", "fulfilled"]);
  if (order && accepted.has(order.status)) return { id: order.id, reused: true, status: order.status };
  const variant = await printfulApi(`/store/variants/${input.variantId}`);
  const ids = variant.files.filter((f: { type: string }) => f.type !== "preview").map((f: { id: number }) => f.id).sort((a: number, b: number) => a - b).join(",");
  if (ids !== session.metadata?.print_file_ids || !variant.synced || variant.availability_status !== "active") throw new Error("Product changed since checkout");
  const item = livePrintItem(input.variantId, input.quantity, variant.files);
  if (!order) {
    try {
      order = await printfulApi("/orders", "POST", { external_id: external, shipping: "STANDARD",
        recipient: { ...input.recipient, email: session.customer_details?.email ?? undefined }, items: [item],
        packing_slip: { store_name: "Modern Relic", message: "Old soul. Modern tools. Thank you for your order." },
      });
    } catch (e) { order = await existing(); if (!order) throw e; }
  }
  if (accepted.has(order.status)) return { id: order.id, reused: true, status: order.status };
  if (order.status !== "draft" || order.external_id !== external || order.items?.length !== 1
    || order.items[0].sync_variant_id !== input.variantId || order.items[0].quantity !== input.quantity) throw new Error("Draft changed");
  for (const [key, value] of Object.entries(input.recipient)) if ((order.recipient?.[key] ?? "") !== value) throw new Error("Draft recipient changed");
  const actualIds = order.items[0].files.filter((f: { type: string }) => f.type !== "preview").map((f: { id: number }) => f.id).sort((a: number, b: number) => a - b).join(",");
  if (actualIds !== ids || order.costs?.currency !== "USD") throw new Error("Draft artwork or currency changed");
  verifyMargin(session.amount_total!, balance.fee, moneyCents(order.costs.total), input.quantity);
  try {
    const confirmed = await printfulApi(`/orders/${order.id}/confirm`, "POST");
    if (!accepted.has(confirmed.status)) throw new Error("Order not accepted");
    return { id: confirmed.id, reused: false, status: confirmed.status };
  } catch (e) {
    const retry = await existing();
    if (retry && accepted.has(retry.status)) return { id: retry.id, reused: true, status: retry.status };
    throw e;
  }
}
