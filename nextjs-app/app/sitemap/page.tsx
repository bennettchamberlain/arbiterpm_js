import { sanityFetch } from "@/sanity/lib/live";
import { sitemapData } from "@/sanity/lib/queries";
import Navigation from "@/app/components/Navigation";
import Link from "next/link";

export default async function SitemapPage() {
  const { data: pagesAndPosts } = await sanityFetch({
    query: sitemapData,
  });

  return (
    <>
      <Navigation />
      <main className="container py-24">
        <h1 className="text-4xl font-bold mb-12 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Sitemap
        </h1>
        
        <div className="grid gap-12 md:grid-cols-2">
          {/* Main Pages */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">Main Pages</h2>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/" 
                  className="text-gray-300 hover:text-purple-400 transition-colors underline"
                >
                  Home
                </Link>
              </li>
              {pagesAndPosts?.filter(item => item._type === 'page').map((page) => (
                <li key={page.slug}>
                  <Link 
                    href={`/${page.slug}`}
                    className="text-gray-300 hover:text-purple-400 transition-colors underline"
                  >
                    {page.slug.charAt(0).toUpperCase() + page.slug.slice(1)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Blog Posts */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">Blog Posts</h2>
            <ul className="space-y-4">
              {pagesAndPosts?.filter(item => item._type === 'post').map((post) => (
                <li key={post.slug}>
                  <Link 
                    href={`/post/${post.slug}`}
                    className="text-gray-300 hover:text-purple-400 transition-colors underline"
                  >
                    {post.slug.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
} 