import type { Metadata } from "next";
import Image from "next/image";
import { getModernRelicContentOrThrow, modernRelicMetadata, splitParagraphs } from "@/app/_content";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";

export const metadata: Metadata = modernRelicMetadata(
  "Contact Modern Relic | Products & Collaborations",
  "Contact Modern Relic about retro clothing, mugs, prints, accessories, gifts, and design collaborations.",
  "/contact",
);

export default function ModernRelicContactPage() {
  const content = getModernRelicContentOrThrow();
  const pageContent = content.modernRelicPages;

  return (
    <ModernRelicShell socialLinks={content.socialLinks}>
      <section className="page-hero">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>Meet The Maker.</h1>
          <p>Product questions, original designs, and collaborations.</p>
        </div>
      </section>

      <section className="section">
        <div className="maker-card">
          <div className="maker-photo-wrap">
            <Image
              src="/images/modern-relic/alex-lawrence-modern-relic-workshop.jpg"
              alt="Alex Lawrence working in the Modern Relic workshop"
              className="maker-photo"
              width={1400}
              height={1400}
              sizes="(max-width: 900px) 100vw, 420px"
              priority
            />
          </div>

          <div className="maker-info">
            <p className="eyebrow">Modern Relic</p>
            <h2>Alex Lawrence</h2>
            <p className="maker-title">Artist • Maker • Creator</p>

            {splitParagraphs(pageContent?.contactMakerText ?? "").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}

            <a className="btn primary" href="mailto:alex@modernrelic.com">
              alex@modernrelic.com
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="contact-card">
          <h2>Get In Touch</h2>
          <p>{pageContent?.contactFormIntro}</p>

          <a className="btn primary" href="mailto:alex@modernrelic.com">Email Modern Relic</a>
        </div>
      </section>

      <section className="section contact-grid">
        <div className="contact-card">
          <h2>Follow</h2>
          <p>{pageContent?.contactFollowText}</p>

          <div className="social-list">
            <a href="https://youtube.com/@modernrelicshow" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="https://www.instagram.com/modernrelicshow" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@modernrelic.com" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="https://www.facebook.com/ModernRelicShow" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>

        <div className="contact-card">
          <h2>The Shop</h2>
          <p>{pageContent?.contactShopText}</p>
          <a className="btn secondary" href="/shop">Visit The Shop</a>
        </div>
      </section>
    </ModernRelicShell>
  );
}
