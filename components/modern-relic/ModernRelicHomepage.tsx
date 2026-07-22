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
            <a className="btn primary" href={content.ctaButtonUrl} target="_blank" rel="noopener noreferrer">
              {content.ctaButtonText}
            </a>
            <a className="btn secondary" href="/shop">
              Visit The Shop
            </a>
          </div>
        </div>
      </section>

      <section className="ticker">
        <span>Design</span>
        <span>Print</span>
        <span>Build</span>
        <span>Create</span>
      </section>

      <section className="section intro-grid">
        <div>
          <p className="eyebrow">Welcome To Modern Relic</p>
          <h2>Turning ideas into things worth keeping.</h2>
        </div>
        <div className="copy">
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="section cards-section">
        <div className="card">
          <h3>Design</h3>
          <p>Logos, branding, graphics, apparel artwork, layout, and visual identity.</p>
        </div>
        <div className="card">
          <h3>Print</h3>
          <p>Stickers, labels, decals, packaging graphics, and custom printed materials.</p>
        </div>
        <div className="card">
          <h3>Build</h3>
          <p>Laser engraving, resin printing, product mockups, prototypes, and fabrication.</p>
        </div>
        <div className="card">
          <h3>Create</h3>
          <p>Original artwork, video content, tutorials, experiments, and one-of-a-kind projects.</p>
        </div>
      </section>

      <section className="feature">
        <div className="feature-content">
          <p className="eyebrow">The Modern Relic Show</p>
          <h2>Follow the process.</h2>
          <p>{content.servicesText}</p>
          <a className="btn primary" href="https://youtube.com/@modernrelicshow" target="_blank" rel="noopener noreferrer">
            Subscribe on YouTube
          </a>
        </div>
      </section>

      <section className="section split">
        <div>
          <p className="eyebrow">Products</p>
          <h2>The shop lives next door.</h2>
          <p>Products, stickers, prints, apparel, and custom creations are handled through the Square store at /shop.</p>
        </div>
        <a className="big-link" href="/shop">Shop Modern Relic →</a>
      </section>

      <section className="section workbench-section">
        <div className="workbench-card">
          <p className="eyebrow">What&apos;s On The Workbench</p>
          <h2>The workshop is always evolving.</h2>
          <p>
            Current projects include growing The Modern Relic Show, Sticker Pack Vol. 1, product prototyping,
            resin printing experiments, laser engraving projects, and ongoing website and brand development.
          </p>
          <p>Some projects succeed. Some fail. Most teach something valuable.</p>

          <div className="workbench-list">
            <span>The Modern Relic Show</span>
            <span>Sticker Pack Vol. 1</span>
            <span>Product Prototypes</span>
            <span>Resin Printing</span>
            <span>Laser Engraving</span>
            <span>Brand Development</span>
          </div>

          <a className="btn secondary" href="https://modernrelic.com/now.html" target="_blank" rel="noopener noreferrer">
            See What I&apos;m Working On
          </a>
        </div>
      </section>

      <section className="section latest-section">
        <div>
          <p className="eyebrow">Latest From The Workshop</p>
          <h2>Follow the creative process.</h2>
          <p>
            The Modern Relic Show follows the creative process behind design, fabrication, experimentation,
            and product development.
          </p>
          <p>
            From branding and stickers to laser engraving and resin printing, every project starts with an idea and ends with a lesson.
          </p>
        </div>
        <div className="latest-card">
          <h3>The Modern Relic Show</h3>
          <p>Watch concepts move from sketchbooks and screens into physical objects and finished creations.</p>
          <a className="btn primary" href="https://youtube.com/@modernrelicshow" target="_blank" rel="noopener noreferrer">
            Watch On YouTube
          </a>
        </div>
      </section>

    </ModernRelicShell>
  );
}
