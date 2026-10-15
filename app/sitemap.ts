import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/about", "/projects", "/workshop", "/shop", "/now", "/contact"].map(
    (path) => ({ url: new URL(path, "https://www.modernrelic.com").toString() }),
  );
}
