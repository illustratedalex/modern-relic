import { createHash } from "node:crypto";
import type Stripe from "stripe";
import { printfulApi, quoteInputSchema, SupplierError, VERIFIED_VARIANTS } from "./quote";
export function draftExternalId(sessionId: string) { return `mr-test-${createHash("sha256").update(sessionId).digest("hex").slice(0,24)}`; }
export function paidOrderInput(session: Stripe.Checkout.Session) {
  if (session.livemode || session.payment_status !== "paid" || session.status !== "complete" || session.currency !== "usd"
    || session.metadata?.brand !== "modern-relic" || session.metadata?.sandbox !== "true"
    || session.amount_total !== Number(session.metadata?.expected_total)) throw new Error("Session is not an eligible paid test order");
  const m = session.metadata;
  const input = quoteInputSchema.parse({ variantId: Number(m.variant_id), quantity: Number(m.quantity), recipient: {
    name: m.recipient_name, address1: m.address1, address2: m.address2 ?? "", city: m.city,
    state_code: m.state, country_code: m.country, zip: m.zip,
  }});
  if (!VERIFIED_VARIANTS.has(input.variantId)) throw new Error("Unknown variant");
  return input;
}
export async function createPaidDraft(session: Stripe.Checkout.Session) {
  const input = paidOrderInput(session);
  const external = draftExternalId(session.id);
  async function existing() {
    try { return await printfulApi(`/orders/@${external}`); } catch (e) { if (e instanceof SupplierError && e.status === 404) return null; throw e; }
  }
  const prior = await existing();
  if (prior) { if (prior.status !== "draft") throw new Error("Unexpected test order status"); return { id: prior.id, reused: true }; }
  const variant = await printfulApi(`/store/variants/${input.variantId}`);
  const fileIds = variant.files.filter((f: {type:string}) => f.type !== "preview").map((f: {id:number}) => f.id).sort((a:number,b:number)=>a-b).join(",");
  if (fileIds !== session.metadata?.print_file_ids) throw new Error("Print files changed since checkout");
  try {
    // Never pass confirm=true. The Orders API creates an uncharged draft by default.
    const order = await printfulApi("/orders", "POST", {
      external_id: external, shipping: "STANDARD", recipient: { ...input.recipient, email: session.customer_details?.email ?? undefined },
      items: [{ sync_variant_id: input.variantId, quantity: input.quantity }],
      packing_slip: { store_name: "Modern Relic", message: "SANDBOX TEST — DO NOT FULFILL" },
    });
    if (order.status !== "draft") throw new Error("Unexpected test order status");
    return { id: order.id, reused: false };
  } catch (e) {
    // A retry or concurrent webhook can find the same unique external_id after a timeout/conflict.
    const order = await existing();
    if (order?.status === "draft") return { id: order.id, reused: true };
    throw e;
  }
}
