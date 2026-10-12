import { checkPrintfulConnection, getPrintfulCatalog } from "@/lib/printful";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Preview diagnostics only; never expose this route on the production site.
export async function GET() {
  if (process.env.VERCEL_ENV !== "preview") {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  const connection = await checkPrintfulConnection();
  const catalog = connection.connected ? await getPrintfulCatalog() : null;
  return Response.json({
    ...connection,
    products: catalog?.products.map(({id, name, variants}) => ({id, name, variants})) ?? [],
    environment: "preview",
    fulfillmentEnabled: false,
    checkedAt: new Date().toISOString(),
  }, {
    status: connection.connected ? 200 : 503,
    headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}
