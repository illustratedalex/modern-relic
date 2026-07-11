import type { Metadata } from "next";
import { getModernRelicContentOrThrow, modernRelicMetadata } from "@/app/_content";
import { ModernRelicHomepage } from "@/components/modern-relic/ModernRelicHomepage";

export function generateMetadata(): Metadata {
  const content = getModernRelicContentOrThrow();

  return modernRelicMetadata(content.seoTitle, content.seoDescription, "/");
}

export default function ModernRelicPage() {
  const content = getModernRelicContentOrThrow();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Modern Relic",
    url: "https://modernrelic.com",
    logo: "https://modernrelic.com/assets/modern-relic-logo.png",
    sameAs: content.socialLinks.map((link) => link.url),
    founder: { "@type": "Person", name: "Alex Lawrence" },
    description: content.seoDescription,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ModernRelicHomepage content={content} />
    </>
  );
}
