import { NextResponse } from "next/server";
import { buildQuote, publicQuote, quoteInputSchema } from "@/lib/checkout/quote";
import { liveCheckoutEnabled, liveOrigin, verifiedLiveStripe } from "@/lib/checkout/live";
export const maxDuration = 60;
export async function POST(request: Request) {
  if (!liveCheckoutEnabled()) return new NextResponse(null, { status: 404 });
  if (!liveOrigin(request)) return new NextResponse(null, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 8000) throw new Error("Request too large");
    const input = quoteInputSchema.safeParse(JSON.parse(text));
    if (!input.success) return NextResponse.json({ error: "Check your shipping address and selection." }, { status: 400 });
    await verifiedLiveStripe();
    return NextResponse.json(publicQuote(await buildQuote(input.data, true)), { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "We couldn’t calculate this order. Please try again shortly." }, { status: 503 }); }
}
