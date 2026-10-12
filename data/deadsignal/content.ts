export type SiteSocialLink = {
  platform: string;
  url: string;
};

export type ModernRelicPages = {
  aboutStoryText: string;
  aboutPhilosophyText: string;
  aboutMissionText: string;
  contactMakerText: string;
  contactFormIntro: string;
  contactFollowText: string;
  contactShopText: string;
  nowLastUpdatedLabel: string;
  nowIntroText: string;
  nowFollowText: string;
  projectsIntroText: string;
  workshopIntroText: string;
  workshopLatestText: string;
};

export type SiteContentRecord = {
  slug: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  servicesText: string;
  ctaButtonText: string;
  ctaButtonUrl: string;
  socialLinks: SiteSocialLink[];
  modernRelicPages: ModernRelicPages;
};

const modernRelicContent: SiteContentRecord = {
  slug: "modern-relic",
  seoTitle: "Modern Relic | Retro Clothing, Mugs & Gifts",
  seoDescription:
    "Modern Relic brings an old-school spirit to retro clothing, mugs, prints, accessories, and gifts. Original designs for analog souls of every generation.",
  heroTitle: "Modern Relic",
  heroSubtitle: "Retro spirit. Everyday goods.",
  aboutText:
    "Modern Relic brings the spirit of the analog years into everyday life.\n\nVintage-inspired artwork, a little attitude, and familiar memories meet clothing, mugs, prints, and gifts for people who grew up with them—and people discovering them now.",
  servicesText:
    "For the generation that remembers rewinding tapes, and anyone who wishes they had been there. Our first collections take their cues from analog life, well-earned character, and after-hours creativity.",
  ctaButtonText: "Explore The Shop",
  ctaButtonUrl: "/shop",
  socialLinks: [
    { platform: "YouTube", url: "https://youtube.com/@modernrelicshow" },
    { platform: "Instagram", url: "https://www.instagram.com/modernrelicshow" },
    { platform: "TikTok", url: "https://www.tiktok.com/@modernrelic.com" },
    { platform: "Facebook", url: "https://www.facebook.com/ModernRelicShow" },
  ],
  modernRelicPages: {
    aboutStoryText:
      "Created by artist Alex Lawrence, Modern Relic brings decades of creative experience to vintage-inspired everyday goods.\n\nThe brand celebrates the music, objects, humor, and character of the analog years, with original designs for every generation.",
    aboutPhilosophyText:
      "Old-school character, original artwork, and modern ways to bring it to life. Nostalgia belongs on the things we use every day.",
    aboutMissionText:
      "Create clothing, mugs, prints, accessories, and gifts with personality—things that bring back a memory or start a conversation.",
    contactMakerText:
      "Modern Relic is my home for original retro-inspired designs and everyday goods.\n\nFor product questions, design ideas, or collaborations, get in touch.",
    contactFormIntro:
      "Have a product question or an idea for Modern Relic? Send a message with the details.",
    contactFollowText: "Follow Modern Relic for new artwork, collection announcements, and product updates.",
    contactShopText: "Explore retro clothing, mugs, prints, accessories, and gifts in the Modern Relic shop.",
    nowLastUpdatedLabel: "October 2026",
    nowIntroText:
      "Modern Relic is becoming a home for retro-inspired everyday goods.\n\nThe first collections are in development. Products will appear in the shop as they are ready for launch.",
    nowFollowText: "Collection announcements and product updates will be shared through the shop and our social channels.",
    projectsIntroText:
      "Three directions for our first collections. Artwork and products are in development; these are a look at what is coming.",
    workshopIntroText:
      "The workshop is where original Modern Relic artwork takes shape.\n\nVintage lettering, analog objects, and a little irreverent humor inspire designs for clothing, mugs, prints, and more.",
    workshopLatestText:
      "The first designs are in development. Explore the planned collections for a look at their inspiration.",
  },
};

const siteContentBySlug: Record<string, SiteContentRecord> = {
  [modernRelicContent.slug]: modernRelicContent,
};

export function getSiteContentBySlug(slug: string): SiteContentRecord | undefined {
  return siteContentBySlug[slug];
}
