import type { SiteContentRecord } from "@/data/deadsignal/content";
import { splitParagraphs } from "@/app/_content";
import { ModernRelicShell } from "@/components/modern-relic/ModernRelicShell";

type ModernRelicHomepageProps = {
  content: SiteContentRecord;
};

export function ModernRelicHomepage({ content }: ModernRelicHomepageProps) {
  const aboutParagraphs = splitParagraphs(content.aboutText);

  return (
    <ModernRelicShell socialLinks={content.socialLinks}>

      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow">Old Soul. Modern Tools.</p>
          <h1>{content.heroTitle}</h1>
          <p className="hero-sub">{content.heroSubtitle}</p>
          <div>
            <a className="btn primary" href={content.ctaButtonUrl}>
              {content.ctaButtonText}
            </a>
            <a className="btn secondary" href="/projects">
              Explore Collections
            </a>
          </div>
        </div>
      </section>

      <section className="ticker">
        <span>Clothing</span>
        <span>Mugs</span>
        <span>Prints</span>
        <span>Gifts</span>
      </section>

      <section className="section intro-grid">
        <div>
          <p className="eyebrow">Welcome To Modern Relic</p>
          <h2>An old soul never goes out of style.</h2>
        </div>
        <div className="copy">
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section cards-section">
        <div className="card">
          <h3>Clothing</h3>
          <p>Vintage-inspired graphics for shirts, sweatshirts, and everyday wear.</p>
        </div>
        <div className="card">
          <h3>Mugs &amp; Drinkware</h3>
          <p>A little nostalgia for your morning coffee and your everyday rituals.</p>
        </div>
        <div className="card">
          <h3>Prints &amp; Decor</h3>
          <p>Original artwork with analog character for the spaces you call your own.</p>
        </div>
        <div className="card">
          <h3>Gifts &amp; Accessories</h3>
          <p>Small things with personality, for yourself or another old soul.</p>
        </div>
      </section>

      <section className="feature">
        <div className="feature-content">
          <p className="eyebrow">The Modern Relic Spirit</p>
          <h2>Built then. Worn now.</h2>
          <p>{content.servicesText}</p>
          <a className="btn primary" href="/projects">
            Explore Collections
          </a>
        </div>
      </section>

      <section className="section split">
        <div>
          <p className="eyebrow">Products</p>
          <h2>Everyday goods. Old-school character.</h2>
          <p>Our retro collections are taking shape across clothing, mugs, prints, and gifts. Visit the shop for launch updates.</p>
        </div>
        <a className="big-link" href="/shop">Shop Modern Relic →</a>
      </section>

      <section className="section workbench-section">
        <div className="workbench-card">
          <p className="eyebrow">What&apos;s On The Workbench</p>
          <h2>The first collections are taking shape.</h2>
          <p>
            Analog Originals, Still Running, and After Hours bring together familiar objects, well-earned attitude,
            and vintage artwork. Each collection is in development.
          </p>
          <p>For people with a little history—and anyone drawn to the look of another era.</p>

          <div className="workbench-list">
            <span>Analog Originals</span>
            <span>Still Running</span>
            <span>After Hours</span>
            <span>Retro Clothing</span>
            <span>Mugs &amp; Prints</span>
            <span>Everyday Gifts</span>
          </div>

          <a className="btn secondary" href="/now">
            See What I&apos;m Working On
          </a>
        </div>
      </section>

      <section className="section latest-section">
        <div>
          <p className="eyebrow">From The Workshop</p>
          <h2>Original designs. Familiar feelings.</h2>
          <p>
            Modern Relic draws on the analog years: mixtapes, garage nights, record collections,
            and the things that gathered stories along the way.
          </p>
          <p>
            Our artwork is original, with vintage influences that feel at home on everyday goods.
          </p>
        </div>
        <div className="latest-card">
          <h3>Something Worth Keeping</h3>
          <p>Explore the inspiration behind our first collections while the shop gets ready for launch.</p>
          <a className="btn primary" href="/projects">
            Explore Collections
          </a>
        </div>
      </section>

    </ModernRelicShell>
  );
}
