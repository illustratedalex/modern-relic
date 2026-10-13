import Stripe from "stripe";
export const LIVE_ACCOUNT = "acct_1UPt6eIi8Fa7piXl";
export const LIVE_ORIGIN = "https://www.modernrelic.com";
export function liveCheckoutEnabled() {
  return process.env.VERCEL_ENV === "production" && process.env.MODERN_RELIC_LIVE_CHECKOUT === "enabled"
    && process.env.MODERN_RELIC_TAX_POLICY === "nh-unregistered" && !!process.env.STRIPE_LIVE_WEBHOOK_SECRET;
}
export function liveOrigin(request: Request) {
  return request.headers.get("origin") === LIVE_ORIGIN;
}
export async function verifiedLiveStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!liveCheckoutEnabled() || !key || !/^(sk|rk)_live_/.test(key)) throw new Error("Live checkout unavailable");
  const stripe = new Stripe(key, { apiVersion: "2026-08-26.dahlia", timeout: 15000, maxNetworkRetries: 2 });
  const account = await stripe.accounts.retrieve(null);
  if (account.id !== LIVE_ACCOUNT || !account.charges_enabled || !account.payouts_enabled) throw new Error("Live account unavailable");
  // This launch policy is for the owner's confirmed NH business with no registrations.
  // Fail closed if that changes, rather than silently continuing zero-tax collection.
  const registrations = await stripe.tax.registrations.list({ status: "active", limit: 1 });
  if (registrations.data.length) throw new Error("Tax policy needs updating");
  return stripe;
}
