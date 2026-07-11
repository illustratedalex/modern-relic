import type { Metadata } from "next";
import { getModernRelicContentOrThrow, modernRelicMetadata, splitParagraphs } from "@/app/_content";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";

export const metadata: Metadata = modernRelicMetadata(
  "The Workshop | Modern Relic Show, Maker Projects & Creative Process",
  "Watch The Modern Relic Show: art, design, laser engraving, resin printing, maker projects, creative experiments, and behind-the-scenes process.",
  "/workshop.html",
);

export default function ModernRelicWorkshopPage() {
  const content = getModernRelicContentOrThrow();
  const pageContent = content.modernRelicPages;

  return (
    <ModernRelicShell socialLinks={content.socialLinks}>
      <section className="page-hero">
        <div>
          <p className="eyebrow">The Modern Relic Show</p>
          <h1>The Workshop</h1>
          <p>Builds, experiments, designs, failures, fixes, and finished pieces.</p>
          <a className="btn primary" href="https://youtube.com/@modernrelicshow" target="_blank" rel="noopener noreferrer">
            Visit YouTube
          </a>
        </div>
      </section>

      <section className="section intro-grid">
        <div>
          <p className="eyebrow">The Workshop</p>
          <h2>Welcome to the heart of Modern Relic.</h2>
        </div>
        <div className="copy">
          {splitParagraphs(pageContent?.workshopIntroText ?? "").map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section video-section">
        <div>
          <p className="eyebrow">Watch</p>
          <h2>Latest from the channel</h2>
          <p>{pageContent?.workshopLatestText}</p>
        </div>
        <div className="video-frame">
          <iframe
            src="https://www.youtube.com/embed?listType=user_uploads&list=modernrelicshow"
            title="Modern Relic Show YouTube videos"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </section>

      <section className="section cards-section">
        <div className="card">
          <h3>Builds</h3>
          <p>Product ideas, prototypes, tools, tests, and workshop projects.</p>
        </div>
        <div className="card">
          <h3>Designs</h3>
          <p>Logos, graphics, branding, and sketch-to-finished-product work.</p>
        </div>
        <div className="card">
          <h3>Prints</h3>
          <p>Stickers, labels, merch, packaging, and physical product creation.</p>
        </div>
        <div className="card">
          <h3>Lessons</h3>
          <p>What worked, what failed, what changed, and what I learned.</p>
        </div>
      </section>
    </ModernRelicShell>
  );
}
