import { z } from "zod";
import { calculateOrderTotal } from "../pricing";
import { checkPrintfulConnection } from "../printful";
export const recipientSchema = z.object({
  name: z.string().trim().min(2).max(100),
  address1: z.string().trim().min(3).max(100),
  address2: z.string().trim().max(100).default(""),
  city: z.string().trim().min(2).max(100),
  state_code: z.string().regex(/^[A-Z]{2}$/),
  country_code: z.literal("US"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/),
}).strict();
export const quoteInputSchema = z.object({
  variantId: z.number().int().positive(), quantity: z.number().int().min(1).max(10), recipient: recipientSchema,
}).strict();
export type QuoteInput = z.infer<typeof quoteInputSchema>;
export const VERIFIED_VARIANTS = new Set([5568793340,5568793342,5568793344,5568793347,5568793349,5568793351,5568793499,5568793519,5568793523,5568793527,5568793533,5568793536,5568793550,5568793551,5568793552,5568793554,5568793555,5568793556]);
const PRODUCTS = new Set([480846657,480846683,480846703]);
export class SupplierError extends Error { constructor(public status: number) { super("Supplier unavailable"); } }
export async function printfulApi(path: string, method = "GET", body?: unknown) {
  const token = process.env.PRINTFUL_ACCESS_TOKEN?.trim();
  if (!token || !/^\/(store\/variants\/\d+|orders(?:\/[^?]+)?)(?:\?.*)?$/.test(path)) throw new Error("Invalid supplier request");
  const response = await fetch(`https://api.printful.com${path}`, {
    method, headers: { Authorization: `Bearer ${token}`, "X-PF-Store-Id": "18894996", "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body), redirect: "error", signal: AbortSignal.timeout(15000), cache: "no-store",
  });
  if (!response.ok) throw new SupplierError(response.status);
  return (await response.json()).result;
}
export function moneyCents(value: unknown) {
  if (typeof value !== "number" && typeof value !== "string") throw new Error("Invalid amount");
  if (typeof value === "string" && !/^\d+(?:\.\d{1,2})?$/.test(value)) throw new Error("Invalid amount");
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 100000 || Math.abs(n * 100 - Math.round(n * 100)) > 0.000001) throw new Error("Invalid amount");
  return Math.round(n * 100);
}
export async function buildQuote(input: QuoteInput) {
  if (!VERIFIED_VARIANTS.has(input.variantId)) throw new Error("Variant unavailable");
  const connection = await checkPrintfulConnection();
  if (!connection.connected || connection.store.id !== 18894996) throw new Error("Store unavailable");
  const variant = await printfulApi(`/store/variants/${input.variantId}`);
  if (!PRODUCTS.has(variant.sync_product_id) || !variant.synced || variant.is_ignored || variant.currency !== "USD"
    || variant.product?.product_id !== 71 || variant.color !== "Black" || variant.availability_status !== "active"
    || !variant.files?.some((f: {type:string;status:string}) => ["default","front"].includes(f.type) && f.status === "ok")
    || !variant.files?.some((f: {type:string;status:string}) => f.type === "label_inside" && f.status === "ok")) throw new Error("Variant unavailable");
  const estimate = await printfulApi("/orders/estimate-costs", "POST", {
    shipping: "STANDARD", recipient: input.recipient, items: [{ sync_variant_id: input.variantId, quantity: input.quantity }],
  });
  const costs = estimate.costs;
  if (costs?.currency !== "USD") throw new Error("Unsupported quote currency");
  const supplierTotalCents = moneyCents(costs.total);
  const shippingCents = moneyCents(costs.shipping);
  const supplierTaxCents = moneyCents(costs.tax) + moneyCents(costs.vat);
  const productCostCents = supplierTotalCents - shippingCents - supplierTaxCents;
  if (productCostCents <= 0) throw new Error("Invalid supplier total");
  const price = calculateOrderTotal({ productCostCents, shippingCostCents: shippingCents, supplierTaxCents, salesTaxCents: 0,
    quantity: input.quantity, processorBasisPoints: 290, processorFixedCents: 30 });
  return { ...input, name: variant.name, totalCents: price.totalCents, shippingCents, supplierTotalCents,
    supplierTaxCents, productCostCents, printFileIds: variant.files.filter((f: {type:string}) => f.type !== "preview").map((f: {id:number}) => f.id) as number[] };
}
export type OrderQuote = Awaited<ReturnType<typeof buildQuote>>;
export function publicQuote(quote: OrderQuote) {
  return { name: quote.name, quantity: quote.quantity, totalCents: quote.totalCents, shippingCents: quote.shippingCents, currency: "USD" };
}
