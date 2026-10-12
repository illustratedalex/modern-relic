import type { Metadata } from "next";
import Image from "next/image";
import { getModernRelicContentOrThrow, modernRelicMetadata, splitParagraphs } from "@/app/_content";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";

export const metadata: Metadata = modernRelicMetadata(
  "About Modern Relic | Retro Goods & Original Artwork",
  "Meet Modern Relic, the retro lifestyle brand by artist Alex Lawrence, creating original clothing, mugs, prints, accessories, and gifts.",
  "/about",
);

export default function ModernRelicAboutPage() {
  const content = getModernRelicContentOrThrow();
  const pageContent = content.modernRelicPages;

  const storyParagraphs = splitParagraphs(pageContent?.aboutStoryText ?? "");

  return (
    <ModernRelicShell socialLinks={content.socialLinks}>
      <section className="page-hero about-hero">
        <div>
          <p className="eyebrow">About</p>
          <h1>About Modern Relic</h1>
          <p>Old Soul. Modern Tools.</p>
        </div>
      </section>

      <section className="section about-layout">
        <article className="story">
          <h2>Modern Relic was built on a simple idea:</h2>
          <p className="pullquote">The tools may change, but craftsmanship never goes out of style.</p>

          {storyParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <h3>Our Philosophy</h3>
          <p className="pullquote small">Old Soul. Modern Tools.</p>
          <p>{pageContent?.aboutPhilosophyText}</p>

          <h3>What We Do</h3>
          <ul className="two-col-list">
            <li>Retro Clothing</li><li>Mugs &amp; Drinkware</li><li>Art Prints</li>
            <li>Everyday Gifts</li><li>Accessories</li><li>Original Artwork</li>
          </ul>

          <h3>Our Mission</h3>
          <p>{pageContent?.aboutMissionText}</p>

          <p className="signature">
            Modern Relic
            <br />
            <span>Artistry. Craftsmanship. Legacy.</span>
          </p>
        </article>

        <aside className="sticky-image">
          <Image
            src="/images/modern-relic/about-workshop.png"
            alt="Modern Relic workshop scene"
            width={1600}
            height={1067}
            sizes="(max-width: 900px) 100vw, 40vw"
            priority
          />
        </aside>
      </section>
    </ModernRelicShell>
  );
}
