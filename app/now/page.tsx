import type { Metadata } from "next";
import { getModernRelicContentOrThrow, modernRelicMetadata, splitParagraphs } from "@/app/_content";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";

export const metadata: Metadata = modernRelicMetadata(
  "Now | Modern Relic Collection & Shop Updates",
  "Follow the development of Modern Relic retro collections, clothing, mugs, prints, and gifts.",
  "/now",
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
          <p>A snapshot of the collections and everyday goods taking shape at Modern Relic.</p>
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
          <p>Developing original retro artwork and preparing the first Modern Relic collections.</p>
        </div>
        <div className="card">
          <h3>Analog Originals</h3>
          <p>Exploring analog objects, vintage lettering, and familiar memories across clothing and printed goods.</p>
        </div>
        <div className="card">
          <h3>Still Running</h3>
          <p>Developing humor and artwork about experience, character, and staying a little rebellious.</p>
        </div>
        <div className="card">
          <h3>After Hours</h3>
          <p>Working on bold vintage tattoo, garage, and rock-club influences for everyday goods.</p>
        </div>
      </section>

      <section className="section project-list">
        <article className="project-card">
          <span>01</span>
          <h2>Current Goal</h2>
          <p>Bring original retro designs to clothing, mugs, prints, accessories, and gifts while keeping the old-school Modern Relic identity.</p>
        </article>

        <article className="project-card">
          <span>02</span>
          <h2>Current Stage</h2>
          <p>Artwork and product preparation are underway. The first items will appear in the shop as they become ready for launch.</p>
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
          <h2>See what comes next.</h2>
          <p>{pageContent?.nowFollowText}</p>
        </div>
        <a className="big-link" href="/shop">
          Visit The Shop →
        </a>
      </section>
    </ModernRelicShell>
  );
}
