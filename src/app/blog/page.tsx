import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';
import BlogThumbnail from '@/components/BlogThumbnail';
import Navbar from '@/components/Navbar';
import {
  blogCategories,
  blogPosts,
  featuredBlogPost,
  formatBlogDate,
  standardBlogPosts,
} from './posts';

export const metadata: Metadata = {
  title: 'Blog & Insights | DataSentry',
  description:
    'Practical articles and episode recaps on security, privacy, and compliance from the DataSentry team.',
};

const toneStyles = {
  primary: {
    panel: 'bg-primary',
    text: 'text-black',
    badge: 'bg-black text-primary',
    shadow: 'shadow-brutal-yellow',
  },
  secondary: {
    panel: 'bg-secondary',
    text: 'text-white',
    badge: 'bg-white text-secondary',
    shadow: 'shadow-brutal-blue',
  },
  dark: {
    panel: 'bg-background-dark',
    text: 'text-white',
    badge: 'bg-primary text-black',
    shadow: 'shadow-brutal-black',
  },
} as const;

export default function Blog() {
  const latestPost = blogPosts[0];

  return (
    <>
      <Navbar />
      <main>
        <header className="w-full bg-background-dark text-white border-b-[3px] border-black">
          <div className="max-w-[1200px] mx-auto px-6 py-14 md:py-24">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
              <div className="max-w-4xl">
                <div className="inline-block bg-secondary text-white px-3 py-1 font-mono text-xs uppercase mb-6 border border-white/30">
                  Blog & Insights
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight mb-6 font-display">
                  Clear writing for teams dealing with
                  {' '}
                  <span className="text-primary italic">security, privacy, and compliance.</span>
                </h1>
                <p className="text-base md:text-xl text-gray-300 max-w-3xl font-mono leading-relaxed mb-8 border-l-4 border-primary pl-4 sm:pl-6">
                  These articles focus on implementation, not buzzwords. Expect structured recaps, practical guidance, and direct takeaways your team can act on.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <Link
                    className="inline-flex items-center gap-2 bg-primary text-black border-2 border-black px-6 py-3 font-bold text-sm uppercase shadow-brutal-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    href={`/blog/${featuredBlogPost.slug}`}
                  >
                    Read Featured Guide
                    <span className="material-icons text-base">arrow_outward</span>
                  </Link>
                  <Link
                    className="inline-flex items-center gap-2 bg-white text-black border-2 border-black px-6 py-3 font-bold text-sm uppercase hover:bg-primary transition-colors"
                    href="/podcast"
                  >
                    Browse Podcast Recaps
                    <span className="material-icons text-base">headphones</span>
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="border-2 border-white/20 bg-white/5 p-5">
                  <p className="font-mono text-xs uppercase text-gray-400 mb-2">Published Articles</p>
                  <p className="font-display text-4xl font-bold">{blogPosts.length}</p>
                </div>
                <div className="border-2 border-white/20 bg-white/5 p-5">
                  <p className="font-mono text-xs uppercase text-gray-400 mb-2">Core Topics</p>
                  <p className="font-display text-4xl font-bold">{blogCategories.length}</p>
                </div>
                <div className="border-2 border-white/20 bg-white/5 p-5">
                  <p className="font-mono text-xs uppercase text-gray-400 mb-2">Latest Update</p>
                  <p className="font-display text-2xl font-bold">{formatBlogDate(latestPost.publishedAt, 'long')}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="w-full bg-primary border-b-[3px] border-black">
          <div className="max-w-[1200px] mx-auto px-6 py-5">
            <div className="flex flex-wrap gap-3">
              {blogCategories.map((category) => (
                <span
                  key={category}
                  className="border-2 border-black bg-white px-4 py-2 font-mono text-sm font-bold uppercase"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 md:py-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase text-gray-500 mb-2">Featured Article</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-none">Structured, readable, and current.</h2>
            </div>
          </div>

          <article className="bg-white border-[3px] border-black overflow-hidden shadow-brutal-yellow hover:shadow-brutal-black transition-all duration-300">
            <div className="border-b-[3px] border-black bg-[#1FA0DA] p-4 sm:p-5 md:p-6">
              <BlogThumbnail
                className="aspect-[16/9] w-full max-w-[820px] mx-auto"
                coverTitle={featuredBlogPost.coverTitle}
                readingMinutes={featuredBlogPost.readingMinutes}
                slug={featuredBlogPost.slug}
                title={featuredBlogPost.title}
                tone={featuredBlogPost.tone}
              />
            </div>

            <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-white flex flex-col">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-black text-primary px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-black">
                  Featured
                </span>
                <span className="bg-secondary/10 text-secondary px-3 py-1 font-mono text-xs font-bold uppercase border border-secondary">
                  {featuredBlogPost.category}
                </span>
                <span className="text-gray-500 text-xs font-mono uppercase">
                  {formatBlogDate(featuredBlogPost.publishedAt)}
                </span>
                <span className="text-gray-500 text-xs font-mono uppercase">
                  {featuredBlogPost.readingMinutes}
                  {' '}
                  min read
                </span>
              </div>

              <h3 className="text-3xl md:text-5xl font-bold leading-[1.04] mb-5 font-display max-w-5xl">
                <Link className="hover:text-secondary transition-colors" href={`/blog/${featuredBlogPost.slug}`}>
                  {featuredBlogPost.title}
                </Link>
              </h3>

              <p className="text-gray-700 font-mono text-sm md:text-lg leading-relaxed mb-8 border-l-2 border-primary pl-4 max-w-4xl">
                {featuredBlogPost.summary}
              </p>

              <ul className="grid gap-4 md:grid-cols-3 mb-8">
                {featuredBlogPost.keyTakeaways.map((takeaway) => (
                  <li key={takeaway} className="border-2 border-black bg-background-light p-4 text-sm md:text-base text-gray-700 leading-relaxed">
                    <div className="flex items-start gap-3">
                      <span className="material-icons text-primary text-base mt-0.5">north_east</span>
                      <span>{takeaway}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Link
                  href={`/blog/${featuredBlogPost.slug}`}
                  className="inline-flex items-center gap-2 bg-primary border-2 border-black px-6 py-3 font-bold text-sm uppercase shadow-brutal-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  Read Article
                  <span className="material-icons text-base">arrow_forward</span>
                </Link>
              </div>
            </div>
          </article>
        </section>

        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-12 md:pb-20">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <p className="font-mono text-xs uppercase text-gray-500 mb-2">All Articles</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold leading-none">More structured reads.</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {standardBlogPosts.map((post) => {
              const tone = toneStyles[post.tone];

              return (
                <article
                  key={post.slug}
                  className="group border-[3px] border-black bg-white hover:bg-primary/5 transition-colors flex flex-col h-full"
                >
                  <div className="border-b-[3px] border-black">
                    <BlogThumbnail
                      className="aspect-[16/9] w-full"
                      coverTitle={post.coverTitle}
                      readingMinutes={post.readingMinutes}
                      slug={post.slug}
                      title={post.title}
                      tone={post.tone}
                    />
                  </div>

                  <div className="p-6 flex flex-col grow">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="font-mono text-xs text-gray-500 uppercase">
                        {formatBlogDate(post.publishedAt)}
                      </span>
                      <span className="font-mono text-xs text-gray-500 uppercase">
                        {post.readingMinutes}
                        {' '}
                        min read
                      </span>
                    </div>

                    <h4 className="text-2xl font-bold leading-tight mb-3 font-display">
                      <Link className="group-hover:text-secondary transition-colors" href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h4>

                    <p className="text-sm font-mono text-gray-700 leading-relaxed mb-5">
                      {post.excerpt}
                    </p>

                    <ul className="space-y-3 text-sm text-gray-700 mb-6 grow">
                      {post.keyTakeaways.slice(0, 2).map((takeaway) => (
                        <li key={takeaway} className="flex items-start gap-3">
                          <span className="material-icons text-primary text-base mt-0.5">check_circle</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      className={`inline-flex items-center gap-2 font-bold text-sm uppercase mt-auto ${tone.shadow} bg-white border-2 border-black px-5 py-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all self-start`}
                      href={`/blog/${post.slug}`}
                    >
                      Read Article
                      <span className="material-icons text-base">arrow_outward</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
