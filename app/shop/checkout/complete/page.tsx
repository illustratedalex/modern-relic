import { notFound } from "next/navigation";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";
import { getModernRelicContentOrThrow } from "@/app/_content";
export const dynamic="force-dynamic";
export const metadata={title:"Test Payment Submitted | Modern Relic",robots:{index:false,follow:false}};
export default function CompletePage(){
  if(process.env.VERCEL_ENV!=="preview")notFound();
  return <ModernRelicShell socialLinks={getModernRelicContentOrThrow().socialLinks}>
    <section className="page-hero"><div><p className="eyebrow">Modern Relic sandbox</p><h1>Test payment submitted.</h1><p>Your test payment is being checked and an order draft will be prepared after payment is verified. No real charge or shipment.</p><a className="btn primary" href="/shop">Return to the shop</a></div></section>
  </ModernRelicShell>;
}
