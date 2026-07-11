import type { Metadata } from "next";
import { getModernRelicContentOrThrow, modernRelicMetadata, splitParagraphs } from "@/app/_content";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";

export const metadata: Metadata = modernRelicMetadata(
  "Now | Modern Relic Current Projects & Workshop Updates",
  "See what Modern Relic is working on now, including maker projects, sticker packs, laser engraving, resin printing, and The Modern Relic Show.",
  "/now.html",
);

export default function ModernRelicNowPage() {
  const content = getModernRelicContentOrThrow();
  const pageContent = content.modernRelicPages;

  return (
    <ModernRelicShell socialLinks={content.socialLinks}>
      <section className="page-hero">
        <div>
          <p className="eyebrow">Now</p>
          <h1>What I&apos;m Working On.</h1>
          <p>A current snapshot of the projects, tools, experiments, and ideas moving through the Modern Relic workshop.</p>
        </div>
      </section>

      <section className="section intro-grid">
        <div>
          <p className="eyebrow">Last Updated</p>
          <h2>{pageContent?.nowLastUpdatedLabel}</h2>
        </div>
        <div className="copy">
          {splitParagraphs(pageContent?.nowIntroText ?? "").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section cards-section">
        <div className="card">
          <h3>Current Focus</h3>
          <p>Building Modern Relic, growing The Modern Relic Show, and developing the first wave of products.</p>
        </div>
        <div className="card">
          <h3>Sticker Pack Vol. 1</h3>
          <p>Creating the first Modern Relic sticker collection using the brand marks, slogans, and workshop-inspired artwork.</p>
        </div>
        <div className="card">
          <h3>Maker Experiments</h3>
          <p>Testing resin printing, laser engraving, product prototypes, custom labels, and creative fabrication ideas.</p>
        </div>
        <div className="card">
          <h3>Content</h3>
          <p>Documenting the process through YouTube, Instagram, TikTok, and behind-the-scenes project updates.</p>
        </div>
      </section>

      <section className="section project-list">
        <article className="project-card">
          <span>01</span>
          <h2>Current Goal</h2>
          <p>Create meaningful products, document the process, and build a creative workshop brand that blends traditional craftsmanship with modern technology.</p>
        </article>

        <article className="project-card">
          <span>02</span>
          <h2>Current Tools</h2>
          <p>EufyMake printer, resin printer, laser engraver, Adobe Creative Suite, sketchbooks, hand tools, coffee, and whatever machine ends up on the bench next.</p>
        </article>

        <article className="project-card">
          <span>03</span>
          <h2>Current Motto</h2>
          <p>Old Soul. Modern Tools.</p>
        </article>
      </section>

      <section className="section split">
        <div>
          <p className="eyebrow">Follow Along</p>
          <h2>The process is the project.</h2>
          <p>{pageContent?.nowFollowText}</p>
        </div>
        <a className="big-link" href="https://youtube.com/@modernrelicshow" target="_blank" rel="noopener noreferrer">
          Watch The Show →
        </a>
      </section>
    </ModernRelicShell>
  );
}
