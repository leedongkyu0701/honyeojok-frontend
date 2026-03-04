import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL  ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      
    },
    {
      url: `${siteUrl}/destinations`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/spots`,
      lastModified: new Date(),
    },
    {
      url: `${siteUrl}/community`,
      lastModified: new Date(),
    },
  ];
}
