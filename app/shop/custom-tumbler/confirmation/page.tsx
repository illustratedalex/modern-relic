import type { Metadata } from "next";
import Link from "next/link";
import { getModernRelicContentOrThrow, modernRelicMetadata } from "@/app/_content";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";
import { getSquareCheckoutUrl } from "@/data/deadsignal/store";

export const metadata: Metadata = modernRelicMetadata(
  "Tumbler Submission Confirmation | Modern Relic Shop",
  "Your Modern Relic tumbler artwork submission has been received.",
  "/shop/custom-tumbler/confirmation.html",
);

type ConfirmationPageProps = {
  searchParams: Promise<{ reference?: string }>;
};

export default async function ModernRelicCustomTumblerConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { reference } = await searchParams;
  const content = getModernRelicContentOrThrow();
  const checkoutUrl = reference ? getSquareCheckoutUrl(reference) : null;

  return (
    <ModernRelicShell socialLinks={content.socialLinks}>
      <section className="page-hero">
        <div>
          <p className="eyebrow">Submission Received</p>
          <h1>Custom Tumbler Request Confirmed</h1>
          <p>Save your reference number for checkout and support updates.</p>
        </div>
      </section>

      <section className="section">
        <div className="contact-card">
          <h2>Reference Number</h2>
          <p className="mr-reference">{reference ?? "Not provided"}</p>
          <p>
            We will use this reference when reviewing your uploaded files and preparing your proof approval.
          </p>

          <div className="mr-button-row">
            {checkoutUrl ? (
              <a className="btn primary" href={checkoutUrl}>
                Continue to Secure Checkout
              </a>
            ) : (
              <button className="btn primary" type="button" disabled>
                Checkout link not configured
              </button>
            )}
            <Link className="btn secondary" href="/shop/custom-tumbler">
              Back to Product Details
            </Link>
          </div>

          {checkoutUrl ? (
            <p className="mr-checkout-note">
              If Square does not auto-fill your reference, enter <strong>{reference}</strong> in the Square custom
              field or order notes.
            </p>
          ) : (
            <p className="mr-form-error">
              NEXT_PUBLIC_SQUARE_CHECKOUT_URL is not configured yet. Set it to enable secure checkout.
            </p>
          )}
        </div>
      </section>
    </ModernRelicShell>
  );
}
