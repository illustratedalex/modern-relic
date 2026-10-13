import Stripe from "stripe";
// Checkout remains unavailable in Production until live payment, tax and fulfillment verification.
export const SANDBOX_ACCOUNT = "acct_1UPt6kRNaGW3Xqho";
export const CHECKOUT_ORIGIN = "https://modern-relic-checkout-southernvt.vercel.app";
let stripe: Stripe | undefined;
export function sandboxStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (process.env.VERCEL_ENV !== "preview" || !key || !/^(sk|rk)_test_/.test(key)) throw new Error("Sandbox checkout unavailable");
  return stripe ??= new Stripe(key, { apiVersion: "2026-08-26.dahlia", maxNetworkRetries: 2, timeout: 15000 });
}
export async function verifiedSandboxStripe() {
  const client = sandboxStripe();
  const account = await client.accounts.retrieve(null);
  if (account.id !== SANDBOX_ACCOUNT) throw new Error("Sandbox account mismatch");
  return client;
}
export function sameCheckoutOrigin(request: Request) {
  return request.headers.get("origin") === CHECKOUT_ORIGIN;
}
