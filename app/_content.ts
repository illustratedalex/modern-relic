import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteContentBySlug } from "@/data/deadsignal/content";

export function getModernRelicContentOrThrow() {
  const content = getSiteContentBySlug("modern-relic");
  if (!content) {
    notFound();
  }
  return content;
}

export function modernRelicMetadata(title: string, description: string, canonicalPath: string): Metadata {
  const canonicalUrl = new URL(canonicalPath, "https://www.modernrelic.com").toString();

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    icons: {
      icon: "/images/modern-relic/favicon.svg",
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [{ url: "/images/modern-relic/share-image.png" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/modern-relic/share-image.png"],
    },
  };
}

export function splitParagraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}
