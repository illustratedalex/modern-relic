import { NextResponse } from "next/server";
import { buildQuote, publicQuote, quoteInputSchema } from "@/lib/checkout/quote";
import { sameCheckoutOrigin, verifiedSandboxStripe } from "@/lib/checkout/sandbox";
export const maxDuration = 60;
export async function POST(request: Request) {
  if (process.env.VERCEL_ENV !== "preview") return new NextResponse(null, { status: 404 });
  if (!sameCheckoutOrigin(request)) return NextResponse.json({ error: "Request unavailable" }, { status: 403 });
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 8000) throw new Error("Request too large");
    const text = await request.text();
    if (text.length > 8000) throw new Error("Request too large");
    const input = quoteInputSchema.safeParse(JSON.parse(text));
    if (!input.success) return NextResponse.json({ error: "Check your shipping address and selection." }, { status: 400 });
    await verifiedSandboxStripe();
    return NextResponse.json(publicQuote(await buildQuote(input.data)), { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ error: "We couldn’t calculate this order. Please try again shortly." }, { status: 503 }); }
}
