import { headers } from "next/headers";

export async function GET(): Promise<Response> {
  const headersList = await headers();
  const domain = headersList.get("host") || "localhost:3000";

  const robotsTxt = `# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://${domain}/sitemap.xml`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 