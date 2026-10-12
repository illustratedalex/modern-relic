import type { Metadata } from "next";
import { getModernRelicContentOrThrow, modernRelicMetadata } from "@/app/_content";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";
import { getPrintfulCatalog } from "@/lib/printful";
import { unstable_cache } from "next/cache";
import { RetroShirtCard } from "@/components/modern-relic/RetroShirtCard";
const getCachedCatalog = unstable_cache(getPrintfulCatalog, ["modern-relic-catalog-v2"], { revalidate: 60 });

export const dynamic = "force-dynamic";
export const maxDuration = 45;
export const metadata: Metadata = modernRelicMetadata(
  "Shop | Modern Relic Retro Clothing, Mugs & Gifts",
  "Explore Modern Relic retro clothing, mugs, prints, accessories, and gifts. Original designs with an old-school spirit.",
  "/shop",
);

export default async function ModernRelicShopPage() {
  const content = getModernRelicContentOrThrow();
  const catalog = await getCachedCatalog();
  return <ModernRelicShell socialLinks={content.socialLinks}>
    <section className="page-hero shop-compact-hero"><div>
      <p className="eyebrow">The Modern Relic Shop</p>
      <h1>Everyday goods. Old-school character.</h1>
      <p>Retro clothing, mugs, prints, accessories, and gifts for analog souls of every generation.</p>
    </div></section>
    {catalog.products.length > 0 ? <section className="section cards-section">
      {catalog.products.map(product => <RetroShirtCard product={product} key={product.id} />)}
    </section> : <section className="section intro-grid">
      <div><p className="eyebrow">{catalog.ready ? "Coming Soon" : "Shop Update"}</p>
        <h2>{catalog.ready ? "The first collection is on the workbench." : "The collection is taking shape."}</h2>
      </div>
      <div className="copy"><p>{catalog.ready
        ? "Our first products are in development. Explore the collection ideas while we prepare the artwork and get everything ready for launch."
        : "The catalog is temporarily unavailable. Please check back, or contact us with a product question."}</p>
        <a className="btn primary" href="/projects">Explore Collections</a>
      </div>
    </section>}
    <section className="section cards-section shop-info-cards">
      <div className="card"><h3>Clothing</h3><p>Original retro artwork for shirts, sweatshirts, and everyday wear.</p></div>
      <div className="card"><h3>Mugs &amp; Drinkware</h3><p>A little analog character for your daily coffee ritual.</p></div>
      <div className="card"><h3>Prints &amp; Decor</h3><p>Vintage-inspired artwork for your home, studio, or favorite corner.</p></div>
      <div className="card"><h3>Gifts &amp; Accessories</h3><p>Everyday objects with personality, for yourself or another old soul.</p></div>
    </section>
  </ModernRelicShell>;
}
