import type { Metadata } from "next";
import Link from "next/link";
import { getModernRelicContentOrThrow, modernRelicMetadata } from "@/app/_content";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";
import { customTumblerProduct } from "@/data/deadsignal/store";

export const metadata: Metadata = modernRelicMetadata(
  "Shop | Modern Relic Custom Products",
  "Explore Modern Relic custom products and start with the Custom Printed 20 oz Tumbler.",
  "/shop",
);

export default function ModernRelicShopPage() {
  const content = getModernRelicContentOrThrow();

  return (
    <ModernRelicShell socialLinks={content.socialLinks}>
      <section className="page-hero shop-page-hero">
        <div>
          <p className="eyebrow">Shop</p>
          <h1>Modern Relic Store</h1>
          <p>Custom products made to order, starting with our first featured tumbler build.</p>
        </div>
      </section>

      <section className="section intro-grid shop-section shop-feature">
        <div>
          <p className="eyebrow">Featured Product</p>
          <h2>{customTumblerProduct.title}</h2>
          <p className="mr-price">Starting at {customTumblerProduct.startingPrice}</p>
          <p>{customTumblerProduct.shortDescription}</p>
          <Link className="btn primary" href="/shop/custom-tumbler">
            Customize This Tumbler
          </Link>
        </div>

        <div className="card mr-product-preview" aria-label="Custom tumbler product preview placeholder">
          <div className="mr-product-preview-inner">
            <p className="eyebrow">Preview</p>
            <h3>20 oz Stainless Tumbler</h3>
            <p>Placeholder image area. Final product photography will be added in the next step.</p>
          </div>
        </div>
      </section>

      <section className="section cards-section shop-section shop-info-cards">
        <div className="card">
          <h3>Custom Printing</h3>
          <p>Sublimation and UV print options for personal, business, and event-ready designs.</p>
        </div>
        <div className="card">
          <h3>Proof First</h3>
          <p>Every order includes a proof approval step before production starts.</p>
        </div>
        <div className="card">
          <h3>Bulk Friendly</h3>
          <p>Need multiples for teams, gifts, or merch drops? Bulk pricing support is available.</p>
        </div>
        <div className="card">
          <h3>Secure Checkout</h3>
          <p>Checkout is handled through secure payment links after customization details are confirmed.</p>
        </div>
      </section>
    </ModernRelicShell>
  );
}
