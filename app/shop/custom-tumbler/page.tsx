import type { Metadata } from "next";
import Link from "next/link";
import { getModernRelicContentOrThrow, modernRelicMetadata } from "@/app/_content";
import { CustomTumblerArtworkForm } from "@/components/modern-relic/CustomTumblerArtworkForm";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";
import { customTumblerProduct, getSquareCheckoutUrl } from "@/data/deadsignal/store";

export const metadata: Metadata = modernRelicMetadata(
  "Custom Printed 20 oz Tumbler | Modern Relic Shop",
  "Customize a 20 oz tumbler with sublimation or UV printing, personalization options, and proof approval before production.",
  "/shop/custom-tumbler.html",
);

export default function ModernRelicCustomTumblerPage() {
  const content = getModernRelicContentOrThrow();
  const checkoutUrl = getSquareCheckoutUrl();

  return (
    <ModernRelicShell socialLinks={content.socialLinks}>
      <section className="product-compact-banner">
        <div className="product-banner-inner">
          <p className="eyebrow">Shop / Product</p>
          <h1>{customTumblerProduct.title}</h1>
          <p className="product-banner-price">Starting at {customTumblerProduct.startingPrice}</p>
        </div>
      </section>

      <section className="section product-commerce-layout">
        <div className="product-gallery">
          <div className="product-main-image card" aria-label="Custom tumbler product placeholder">
            <div>
              <p className="eyebrow">Product Preview</p>
              <h3>20 oz Stainless Tumbler</h3>
              <p>Image placeholder until final product photography is ready.</p>
            </div>
          </div>
        </div>

        <article className="product-buy-panel">
          <p className="eyebrow">Made to Order</p>
          <h2>{customTumblerProduct.title}</h2>
          <p className="product-price">Starting at {customTumblerProduct.startingPrice}</p>
          <p className="product-description">{customTumblerProduct.shortDescription}</p>

          <h3>Customization Options</h3>
          <ul className="mr-list">
            {customTumblerProduct.personalizationOptions.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>

          <div className="mr-button-row">
            <a className="btn primary product-customize-button" href="#customize">
              Customize Yours
            </a>
            {checkoutUrl ? (
              <a className="btn secondary" href={checkoutUrl}>
                Continue to Secure Checkout
              </a>
            ) : (
              <button className="btn secondary" type="button" disabled>
                Checkout link not configured
              </button>
            )}
          </div>

          <p className="mr-bulk-callout">
            Need a larger run? Bulk and event orders are available with volume pricing.
            <Link href="/contact"> Contact Modern Relic</Link> for a custom quote.
          </p>
        </article>
      </section>

      <section className="section" id="customize">
        <div className="contact-card">
          <p className="eyebrow">Artwork Upload</p>
          <h2>Customize Your Tumbler</h2>
          <p>Complete the form below to upload files and submit your customization request.</p>
          <CustomTumblerArtworkForm />
        </div>
      </section>

      <section className="section">
        <div className="contact-card">
          <h2>Artwork Requirements</h2>
          <ul className="mr-list">
            {customTumblerProduct.artworkRequirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </div>
      </section>
    </ModernRelicShell>
  );
}
