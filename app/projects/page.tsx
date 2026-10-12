import type { Metadata } from "next";
import { getModernRelicContentOrThrow, modernRelicMetadata } from "@/app/_content";
import { coffeeDesigns } from "@/data/deadsignal/retro-products";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";

export const metadata: Metadata = modernRelicMetadata(
  "Retro Collections | Modern Relic",
  "Discover the inspiration behind Modern Relic's upcoming collections of retro clothing, mugs, prints, accessories, and gifts.",
  "/projects",
);
const collections = [
  { name: "Analog Originals", text: "Mixtapes, record players, arcades, and the objects that made the analog years unforgettable. Original artwork inspired by a life before everything went digital." },
  { name: "Still Running", text: "A little mileage. A lot of character. Humor and attitude for people who have stories to tell and plenty left to do." },
  { name: "After Hours", text: "Vintage tattoo influences, garage nights, and rock-club energy. Bold artwork with an old-school soul." },
];
export default function ModernRelicProjectsPage() {
  const content = getModernRelicContentOrThrow();
  return <ModernRelicShell socialLinks={content.socialLinks}>
    <section className="page-hero"><div><p className="eyebrow">Collections · In Development</p><h1>Retro spirit. Everyday goods.</h1><p>{content.modernRelicPages.projectsIntroText}</p></div></section>
    <section className="section project-list">{collections.map((collection, index) => <article className="project-card" key={collection.name}>
      <span>0{index + 1}</span><h2>{collection.name}</h2><p>{collection.text}</p>
    </article>)}</section>
    <section className="section intro-grid"><div><p className="eyebrow">Coffee Collection · Designs In Development</p><h2>Old soul. Fresh brew.</h2></div><div className="copy"><p>Three original mug designs with the same worn vintage character as our clothing. Mug products are coming next.</p></div></section>
    <section className="section cards-section">{coffeeDesigns.map(design => <article className="card" key={design.slug}>
      <img src={`/images/modern-relic/products/${design.slug}.png`} alt={`${design.title} mug design artwork`} width="1448" height="1086" loading="lazy" style={{width:"100%",height:"auto"}} />
      <h2>{design.title}</h2><p>{design.description}</p><p>Mug design preview · Not available to order yet.</p>
    </article>)}</section>
    <section className="section split"><div><p className="eyebrow">The Shop</p><h2>More than a shirt.</h2><p>Clothing, mugs, prints, accessories, and gifts will appear as each design is ready for launch.</p></div><a className="big-link" href="/shop">Visit The Shop →</a></section>
  </ModernRelicShell>;
}
