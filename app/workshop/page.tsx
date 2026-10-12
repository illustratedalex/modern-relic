import type { Metadata } from "next";
import { getModernRelicContentOrThrow, modernRelicMetadata, splitParagraphs } from "@/app/_content";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";
export const metadata: Metadata = modernRelicMetadata("The Workshop | Modern Relic Original Designs", "Explore the original artwork and vintage influences behind Modern Relic retro clothing, mugs, prints, and gifts.", "/workshop");
export default function ModernRelicWorkshopPage() {
  const content = getModernRelicContentOrThrow();
  return <ModernRelicShell socialLinks={content.socialLinks}>
    <section className="page-hero"><div><p className="eyebrow">Original Artwork</p><h1>The Workshop</h1><p>Old Soul. Modern Tools.</p><a className="btn primary" href="/projects">Explore Collections</a></div></section>
    <section className="section intro-grid"><div><p className="eyebrow">The Workshop</p><h2>Where the old-school spirit takes shape.</h2></div><div className="copy">{splitParagraphs(content.modernRelicPages.workshopIntroText).map(text => <p key={text}>{text}</p>)}</div></section>
    <section className="section cards-section">
      <div className="card"><h3>Vintage Lettering</h3><p>Type with character, inspired by signs, record sleeves, and the everyday graphics of another era.</p></div>
      <div className="card"><h3>Analog Life</h3><p>Familiar objects and memories, reimagined through original Modern Relic artwork.</p></div>
      <div className="card"><h3>A Little Attitude</h3><p>Humor for people who have lived a little, and younger old souls who get the joke.</p></div>
      <div className="card"><h3>Everyday Goods</h3><p>Designs developed for clothing, mugs, prints, accessories, and gifts.</p></div>
    </section>
  </ModernRelicShell>;
}
