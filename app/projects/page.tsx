import type { Metadata } from "next";
import { getModernRelicContentOrThrow, modernRelicMetadata } from "@/app/_content";
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
    <section className="section split"><div><p className="eyebrow">The Shop</p><h2>More than a shirt.</h2><p>Clothing, mugs, prints, accessories, and gifts will appear as each design is ready for launch.</p></div><a className="big-link" href="/shop">Visit The Shop →</a></section>
  </ModernRelicShell>;
}
