import type { Metadata } from "next";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { format, parseISO } from "date-fns";

import { sanityFetch } from "@/sanity/lib/live";
import { postQuery, postPagesSlugs } from "@/sanity/lib/queries";
import { PageOnboarding } from "@/app/components/Onboarding";
import Navigation from "@/app/components/Navigation";
import { urlForImage } from "@/sanity/lib/image";
import { linkResolver } from "@/sanity/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

type Post = {
  _id: string;
  title: string;
  excerpt?: string;
  content: any;
  coverImage?: {
    asset?: {
      _ref: string;
      _type: 'reference';
      _weak?: boolean;
    };
    hotspot?: any;
    crop?: any;
  };
  date?: string;
  author?: {
    firstName: string;
    lastName: string;
    picture?: string;
  };
  cta?: {
    heading: string;
    text?: string;
    buttonText?: string;
    link?: {
      _type: "link";
      linkType?: "href" | "page" | "post";
      href?: string;
      page?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
      };
      post?: {
        _ref: string;
        _type: "reference";
        _weak?: boolean;
      };
      openInNewTab?: boolean;
    };
  } | null;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: postPagesSlugs,
    // // Use the published perspective in generateStaticParams
    perspective: "published",
    stega: false,
  });
  return data;
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { data: post } = await sanityFetch({
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  });

  return {
    title: post?.title,
    description: post?.excerpt,
  } satisfies Metadata;
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const { data: post } = await sanityFetch({ 
    query: postQuery, 
    params 
  }) as { data: Post };

  if (!post?._id) {
    return (
      <div className="py-40">
        <PageOnboarding />
      </div>
    );
  }

  const coverImageUrl = post.coverImage ? urlForImage(post.coverImage)?.url() : null;
  const ctaLink = post.cta?.link ? linkResolver(post.cta.link) : null;

  return (
    <>
      <Navigation />
      <article className="my-12 lg:my-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent sm:text-5xl lg:text-7xl mb-4">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-xl text-gray-300 mb-6">
                  {post.excerpt}
                </p>
              )}
              
              {/* Author and Date */}
              <div className="flex items-center gap-4 text-gray-300">
                {post.author && (
                  <div className="flex items-center gap-2">
                    {post.author.picture && (
                      <Image
                        src={post.author.picture}
                        alt={`${post.author.firstName} ${post.author.lastName}`}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <span>
                      {post.author.firstName} {post.author.lastName}
                    </span>
                  </div>
                )}
                {post.date && (
                  <time dateTime={post.date}>
                    {format(parseISO(post.date), 'MMMM d, yyyy')}
                  </time>
                )}
              </div>
            </header>

            {/* Cover Image */}
            {coverImageUrl && (
              <div className="mb-8 relative">
                <div className="absolute -top-12 -right-8 sm:-top-20 sm:-right-14 w-20 h-20 sm:w-32 sm:h-32 z-10">
                  <Image
                    src="/Arbiter Stars/Slanted/Star_slanted.png"
                    alt="Decorative star"
                    width={128}
                    height={128}
                    className="object-contain"
                  />
                </div>
                <Image
                  src={coverImageUrl}
                  alt={post.title}
                  width={1200}
                  height={600}
                  className="rounded-lg"
                  priority
                />
              </div>
            )}

            {/* Content */}
            {post.content && (
              <div className="prose prose-lg max-w-none prose-invert">
                <PortableText value={post.content} />
              </div>
            )}

            {/* CTA */}
            {post.cta && (
              <div className="mt-12 relative">
                <div className="absolute -top-10 sm:-top-8 -left-4 w-40 h-40 sm:w-64 sm:h-64 z-10">
                  <Image
                    src="/Arbiter Stars/Together/Star_together.png"
                    alt="Decorative star"
                    width={256}
                    height={256}
                    className="object-contain"
                  />
                </div>
                <div className="p-8 pt-24 sm:pt-8 bg-gray-800/50 rounded-lg backdrop-blur-sm text-right">
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                    {post.cta.heading}
                  </h2>
                  {post.cta.text && <p className="mb-6 text-gray-300">{post.cta.text}</p>}
                  {post.cta.buttonText && ctaLink && (
                    <a
                      href={ctaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all"
                    >
                      {post.cta.buttonText}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
