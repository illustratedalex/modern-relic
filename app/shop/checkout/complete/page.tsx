import { liveCheckoutEnabled } from "@/lib/checkout/live";
import { notFound } from "next/navigation";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";
import { getModernRelicContentOrThrow } from "@/app/_content";
export const dynamic="force-dynamic";
export const metadata={title:"Payment Submitted | Modern Relic",robots:{index:false,follow:false}};
export default function CompletePage(){
  const live=liveCheckoutEnabled();
  if(process.env.VERCEL_ENV!=="preview"&&!live)notFound();
  return <ModernRelicShell socialLinks={getModernRelicContentOrThrow().socialLinks}>
    <section className="page-hero"><div><p className="eyebrow">{live?"Modern Relic":"Modern Relic sandbox"}</p><h1>{live?"Payment submitted.":"Test payment submitted."}</h1><p>{live?"We’re verifying your payment and preparing your order. If your payment is still pending, production starts after it clears.":"Your test payment is being checked and an order draft will be prepared after payment is verified. No real charge or shipment."}</p><a className="btn primary" href="/shop">Return to the shop</a></div></section>
  </ModernRelicShell>;
}
