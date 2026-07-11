export const customTumblerProduct = {
  slug: "custom-tumbler",
  title: "Custom Printed 20 oz Tumbler",
  startingPrice: "$29.95",
  shortDescription:
    "Built for everyday use and printed to match your style, brand, or event. Choose sublimation or UV printing for a durable custom finish.",
  artworkRequirements: [
    "Preferred file types: PNG, SVG, PDF, AI, EPS (300 DPI or vector preferred).",
    "Use transparent backgrounds where possible for clean wrap layouts.",
    "Avoid tiny text below 10 pt for best print clarity.",
    "By uploading artwork, you confirm you own rights or permission to print it.",
  ],
  personalizationOptions: [
    "Name personalization",
    "Short quote or phrase",
    "Business logo or event branding",
    "Color-theme matching",
  ],
} as const;

export function getSquareCheckoutUrl(reference?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SQUARE_CHECKOUT_URL;
  if (!baseUrl) {
    return null;
  }

  try {
    const url = new URL(baseUrl);
    if (reference) {
      url.searchParams.set("reference", reference);
    }
    return url.toString();
  } catch {
    return null;
  }
}
