import type { Metadata } from "next";
import { getModernRelicContentOrThrow, modernRelicMetadata } from "@/app/_content";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";

export const metadata: Metadata = modernRelicMetadata(
  "Projects | Custom Stickers, Laser Engraving, Resin Printing & Design",
  "Explore Modern Relic projects in custom design, stickers, labels, laser engraving, resin printing, branding, and creative experiments.",
  "/projects.html",
);

export default function ModernRelicProjectsPage() {
  const content = getModernRelicContentOrThrow();
  const pageContent = content.modernRelicPages;

  return (
    <ModernRelicShell socialLinks={content.socialLinks}>
      <section className="page-hero">
        <div>
          <p className="eyebrow">Projects</p>
          <h1>Design. Print. Build. Create.</h1>
          <p>{pageContent?.projectsIntroText}</p>
        </div>
      </section>

      <section className="section project-list">
        <article className="project-card">
          <span>01</span>
          <h2>Brand Identity</h2>
          <p>Logos, marks, typography, packaging ideas, and visual systems.</p>
        </article>
        <article className="project-card">
          <span>02</span>
          <h2>Sticker &amp; Label Work</h2>
          <p>Printed graphics, product labels, merch, and small-batch designs.</p>
        </article>
        <article className="project-card">
          <span>03</span>
          <h2>Laser Engraving</h2>
          <p>Metal, wood, product marking, custom gifts, and branded objects.</p>
        </article>
        <article className="project-card">
          <span>04</span>
          <h2>Resin Printing</h2>
          <p>Prototypes, custom objects, miniatures, and experimental builds.</p>
        </article>
        <article className="project-card">
          <span>05</span>
          <h2>Creative Experiments</h2>
          <p>Things that do not fit neatly in a box. The strange stuff belongs here.</p>
        </article>
      </section>
    </ModernRelicShell>
  );
}
