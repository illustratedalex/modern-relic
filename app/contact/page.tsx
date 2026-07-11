import type { Metadata } from "next";
import Image from "next/image";
import { getModernRelicContentOrThrow, modernRelicMetadata, splitParagraphs } from "@/app/_content";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";

export const metadata: Metadata = modernRelicMetadata(
  "Contact Modern Relic | Custom Design, Stickers & Creative Projects",
  "Contact Alex Lawrence at Modern Relic for custom design, stickers, labels, laser engraving, resin printing, branding, and creative projects.",
  "/contact.html",
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
          <p>Custom design, products, builds, collaborations, and creative work.</p>
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
          <h2>Project Form</h2>
          <p>{pageContent?.contactFormIntro}</p>

          <form action="https://modernrelic.com/contact.php" method="POST" className="contact-form">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required />

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />

            <label htmlFor="project_type">Project Type</label>
            <select id="project_type" name="project_type">
              <option value="General Question">General Question</option>
              <option value="Logo / Branding">Logo / Branding</option>
              <option value="Stickers / Labels">Stickers / Labels</option>
              <option value="Laser Engraving">Laser Engraving</option>
              <option value="Resin Printing">Resin Printing</option>
              <option value="Custom Product">Custom Product</option>
              <option value="Collaboration">Collaboration</option>
            </select>

            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={8} required />

            <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

            <button className="btn primary" type="submit">
              Send Message
            </button>
          </form>
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
