import { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import { sitemapData } from "@/sanity/lib/queries";
import { headers } from "next/headers";

/**
 * This file creates a sitemap (sitemap.xml) for the application. Learn more about sitemaps in Next.js here: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 * Be sure to update the `changeFrequency` and `priority` values to match your application's content.
 */

export async function GET(): Promise<Response> {
  const allPostsAndPages = await sanityFetch({
    query: sitemapData,
  });
  const headersList = await headers();
  const sitemap: Array<{
    url: string;
    lastModified: Date;
    priority: number;
    changeFrequency?: "monthly" | "always" | "hourly" | "daily" | "weekly" | "yearly" | "never";
  }> = [];
  const domain = headersList.get("host") || "localhost:3000";
  
  // Add the home page
  sitemap.push({
    url: `https://${domain}`,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: "monthly",
  });

  // Add the user-friendly sitemap page
  sitemap.push({
    url: `https://${domain}/sitemap`,
    lastModified: new Date(),
    priority: 0.3,
    changeFrequency: "monthly",
  });

  if (allPostsAndPages != null && allPostsAndPages.data.length != 0) {
    let priority: number;
    let changeFrequency:
      | "monthly"
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "yearly"
      | "never"
      | undefined;
    let url: string;

    for (const p of allPostsAndPages.data) {
      switch (p._type) {
        case "page":
          priority = 0.8;
          changeFrequency = "monthly";
          url = `https://${domain}/${p.slug}`;
          break;
        case "post":
          priority = 0.5;
          changeFrequency = "never";
          url = `https://${domain}/post/${p.slug}`;
          break;
      }
      sitemap.push({
        lastModified: p._updatedAt ? new Date(p._updatedAt) : new Date(),
        priority,
        changeFrequency,
        url,
      });
    }
  }

  // Convert the sitemap to XML format
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${sitemap.map(entry => `
    <url>
      <loc>${entry.url}</loc>
      <lastmod>${entry.lastModified.toISOString()}</lastmod>
      ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
      ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
    </url>
  `).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 