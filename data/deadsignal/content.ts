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
  seoTitle: "Modern Relic | Old Soul. Modern Tools.",
  seoDescription:
    "Modern Relic is a creative workshop by Alex Lawrence focused on design, stickers, branding, laser engraving, resin printing, and one-of-a-kind maker projects.",
  heroTitle: "Modern Relic",
  heroSubtitle: "Design. Print. Build. Create.",
  aboutText:
    "Modern Relic is where old-school craftsmanship meets modern tools.\n\nFrom brand design to physical products, every project starts with a strong idea and gets refined through making.",
  servicesText:
    "Follow the builds, experiments, and behind-the-scenes process from sketchbook ideas to finished pieces.",
  ctaButtonText: "Subscribe on YouTube",
  ctaButtonUrl: "https://youtube.com/@modernrelicshow",
  socialLinks: [
    { platform: "YouTube", url: "https://youtube.com/@modernrelicshow" },
    { platform: "Instagram", url: "https://www.instagram.com/modernrelicshow" },
    { platform: "TikTok", url: "https://www.tiktok.com/@modernrelic.com" },
    { platform: "Facebook", url: "https://www.facebook.com/ModernRelicShow" },
  ],
  modernRelicPages: {
    aboutStoryText:
      "Modern Relic started as a personal workshop and evolved into a brand focused on meaningful creative work.\n\nThe goal is simple: build things worth keeping and share the process honestly.",
    aboutPhilosophyText:
      "Use modern tools with timeless standards. Build with intention, keep quality high, and keep learning through every project.",
    aboutMissionText:
      "Create work that feels handmade, useful, and memorable while helping people bring ideas to life.",
    contactMakerText:
      "I help clients and collaborators with design, product ideas, and production-ready creative work.\n\nIf you have an idea, send it over and let us build it together.",
    contactFormIntro:
      "Tell me what you are trying to make, your timeline, and any references. I will follow up with next steps.",
    contactFollowText: "Follow the latest projects, builds, and experiments across social channels.",
    contactShopText: "Explore stickers, prints, and workshop-made goods in the Modern Relic shop.",
    nowLastUpdatedLabel: "July 2026",
    nowIntroText:
      "Currently focused on growing Modern Relic and shipping the first wave of products.\n\nI am balancing client work, product development, and content production from the workshop.",
    nowFollowText: "New builds and process updates are shared regularly on YouTube and social media.",
    projectsIntroText:
      "A mix of custom client work, in-house product development, and ongoing maker experiments.",
    workshopIntroText:
      "The workshop is where ideas become prototypes, and prototypes become real products.\n\nEvery project is part design process, part fabrication, and part problem-solving.",
    workshopLatestText:
      "Watch recent episodes and behind-the-scenes clips from The Modern Relic Show.",
  },
};

const siteContentBySlug: Record<string, SiteContentRecord> = {
  [modernRelicContent.slug]: modernRelicContent,
};

export function getSiteContentBySlug(slug: string): SiteContentRecord | undefined {
  return siteContentBySlug[slug];
}
