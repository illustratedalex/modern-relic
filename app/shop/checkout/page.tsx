import { liveCheckoutEnabled } from "@/lib/checkout/live";
import { notFound } from "next/navigation";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";
import { CheckoutForm } from "@/components/modern-relic/CheckoutForm";
import { getModernRelicContentOrThrow } from "@/app/_content";
import { getPrintfulCatalog } from "@/lib/printful";
export const dynamic="force-dynamic";
export const maxDuration=60;
export const metadata={title:"Checkout | Modern Relic",robots:{index:false,follow:false}};
export default async function CheckoutPage({searchParams}:{searchParams:Promise<{variant?:string}>}){
  const live=liveCheckoutEnabled();
  if(process.env.VERCEL_ENV!=="preview"&&!live)notFound();
  const catalog=await getPrintfulCatalog();
  const variants=catalog.products.flatMap(p=>p.variants.map(v=>({id:v.id,name:`${p.name} / Black / ${v.size}`})));
  const selected=Number((await searchParams).variant);
  const content=getModernRelicContentOrThrow();
  return <ModernRelicShell socialLinks={content.socialLinks}>
    <section className="page-hero"><div><p className="eyebrow">Modern Relic</p><h1>Review. Then checkout.</h1><p>We’ll calculate shipping for your address before you pay.</p></div></section>
    <section className="section">{variants.length>0?<CheckoutForm live={live} variants={variants} initialVariant={variants.some(v=>v.id===selected)?selected:variants[0].id}/>:<p>The collection is temporarily unavailable. Please try again shortly.</p>}</section>
  </ModernRelicShell>;
}
