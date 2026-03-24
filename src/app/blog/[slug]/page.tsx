import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogThumbnail from '@/components/BlogThumbnail';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { blogPosts, formatBlogDate, getBlogPost, type BlogBlock, type BlogLink } from '../posts';

const toneStyles = {
  primary: {
    panel: 'bg-primary',
    text: 'text-black',
    badge: 'bg-black text-primary',
  },
  secondary: {
    panel: 'bg-secondary',
    text: 'text-white',
    badge: 'bg-white text-secondary',
  },
  dark: {
    panel: 'bg-background-dark',
    text: 'text-white',
    badge: 'bg-primary text-black',
  },
} as const;

function ActionLink({
  link,
  className,
}: {
  link: BlogLink;
  className: string;
}) {
  if (link.external) {
    return (
      <a
        className={className}
        href={link.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {link.label}
        <span className="material-icons text-base">arrow_outward</span>
      </a>
    );
  }

  return (
    <Link className={className} href={link.href}>
      {link.label}
      <span className="material-icons text-base">arrow_forward</span>
    </Link>
  );
}

function ContentBlock({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-base md:text-lg leading-relaxed text-gray-700">
          {block.text}
        </p>
      );
    case 'list':
      if (block.variant === 'check') {
        return (
          <div className="space-y-4">
            {block.title ? (
              <p className="font-mono text-xs font-bold uppercase tracking-wide text-gray-500">
                {block.title}
              </p>
            ) : null}
            <ul className="space-y-3">
              {block.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-gray-700">
                  <span className="material-icons text-primary text-base mt-0.5">check_circle</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          {block.title ? (
            <p className="font-mono text-xs font-bold uppercase tracking-wide text-gray-500">
              {block.title}
            </p>
          ) : null}
          <ul className="list-disc pl-6 space-y-3 text-base text-gray-700 marker:text-primary">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );
    case 'quote':
      return (
        <blockquote className="border-l-[3px] border-primary bg-background-light p-6">
          <p className="font-display text-2xl md:text-3xl font-bold leading-tight text-black">
            {block.text}
          </p>
          {block.attribution ? (
            <footer className="font-mono text-xs font-bold uppercase tracking-wide text-gray-500 mt-4">
              {block.attribution}
            </footer>
          ) : null}
        </blockquote>
      );
    case 'callout':
      return (
        <aside className="border-[3px] border-black bg-primary/10 p-5">
          <p className="font-mono text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
            {block.title}
          </p>
          <p className="text-base text-gray-700 leading-relaxed">{block.text}</p>
        </aside>
      );
    case 'links':
      return (
        <div className="border-[3px] border-black bg-background-light p-5 space-y-4">
          {block.title ? (
            <p className="font-mono text-xs font-bold uppercase tracking-wide text-gray-500">
              {block.title}
            </p>
          ) : null}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {block.links.map((link) => (
              <ActionLink
                key={`${link.label}-${link.href}`}
                className="inline-flex items-center gap-2 bg-white border-2 border-black px-4 py-3 font-bold text-sm uppercase hover:bg-primary transition-colors"
                link={link}
              />
            ))}
          </div>
        </div>
      );
    default:
      return null;
  }
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: 'Blog | DataSentry',
    };
  }

  return {
    title: `${post.title} | DataSentry`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const tone = toneStyles[post.tone];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background-light">
        <header className="w-full bg-background-dark text-white border-b-[3px] border-black">
          <div className="max-w-6xl mx-auto px-6 pt-24 pb-14 md:pt-32 md:pb-20">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase text-gray-300 border border-white/20 px-3 py-2 hover:text-primary hover:border-primary transition-colors mb-8"
            >
              <span className="material-icons text-base">arrow_back</span>
              Back to Blog
            </Link>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="bg-primary text-black px-3 py-1 font-mono text-xs font-bold uppercase border-2 border-black">
                    {post.category}
                  </span>
                  <span className="text-gray-400 font-mono text-xs uppercase">
                    {formatBlogDate(post.publishedAt, 'long')}
                  </span>
                  <span className="text-gray-400 font-mono text-xs uppercase">
                    {post.readingMinutes}
                    {' '}
                    min read
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6 font-display">
                  {post.title}
                </h1>

                <p className="max-w-3xl text-base md:text-xl text-gray-300 font-mono leading-relaxed border-l-4 border-primary pl-4 sm:pl-6">
                  {post.summary}
                </p>
              </div>

              <div className={`${tone.panel} ${tone.text} border-[3px] border-black p-6`}>
                <span className={`inline-block ${tone.badge} border-2 border-black px-3 py-1 font-mono text-xs font-bold uppercase mb-5`}>
                  About the Article
                </span>
                <div className="space-y-4 font-mono text-sm">
                  <div>
                    <p className="opacity-70 uppercase text-xs mb-1">Author</p>
                    <p className="font-bold uppercase">{post.author}</p>
                  </div>
                  <div>
                    <p className="opacity-70 uppercase text-xs mb-1">Role</p>
                    <p className="font-bold uppercase leading-relaxed">{post.authorRole}</p>
                  </div>
                  <div>
                    <p className="opacity-70 uppercase text-xs mb-1">Published</p>
                    <p className="font-bold uppercase">{formatBlogDate(post.publishedAt, 'long')}</p>
                  </div>
                  <div>
                    <p className="opacity-70 uppercase text-xs mb-1">Category</p>
                    <p className="font-bold uppercase">{post.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="max-w-6xl mx-auto px-6 pt-8 md:pt-10">
          <div className="border-[3px] border-black overflow-hidden shadow-brutal-black bg-white">
            <BlogThumbnail
              className="aspect-[16/9] w-full"
              coverTitle={post.coverTitle}
              readingMinutes={post.readingMinutes}
              slug={post.slug}
              title={post.title}
              tone={post.tone}
            />
          </div>
        </section>

        <section className={`w-full ${tone.panel} ${tone.text} border-b-[3px] border-black`}>
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="grid gap-4 md:grid-cols-[200px_minmax(0,1fr)] md:items-start">
              <div>
                <p className="font-mono text-xs font-bold uppercase opacity-80 mb-2">Key Takeaways</p>
              </div>
              <ul className="grid gap-3 md:grid-cols-3">
                {post.keyTakeaways.map((takeaway) => (
                  <li key={takeaway} className="border-2 border-black/20 bg-black/5 px-4 py-3 text-sm leading-relaxed">
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-10 md:py-16 grid gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-6 lg:sticky lg:top-28 self-start">
            {post.disclaimer ? (
              <div className="border-[3px] border-black bg-white p-5">
                <p className="font-mono text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
                  Disclaimer
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{post.disclaimer}</p>
              </div>
            ) : null}

            <div className="border-[3px] border-black bg-white p-5">
              <p className="font-mono text-xs font-bold uppercase tracking-wide text-gray-500 mb-4">
                Article Outline
              </p>
              <nav className="space-y-3">
                {post.sections.map((section) => (
                  <a
                    key={section.id}
                    className="block text-sm leading-relaxed text-gray-700 hover:text-secondary transition-colors"
                    href={`#${section.id}`}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="space-y-8">
            {post.sections.map((section) => (
              <section
                key={section.id}
                className="bg-white border-[3px] border-black p-6 md:p-8 scroll-mt-28"
                id={section.id}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6 text-black">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.blocks.map((block, index) => (
                    <ContentBlock
                      key={`${section.id}-${block.type}-${index}`}
                      block={block}
                    />
                  ))}
                </div>
              </section>
            ))}

            <section className="bg-primary border-[3px] border-black p-6 md:p-8">
              <p className="font-mono text-xs font-bold uppercase tracking-wide text-black/70 mb-3">
                Next Step
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight text-black mb-4">
                {post.cta.title}
              </h2>
              <p className="text-base md:text-lg text-black/80 leading-relaxed mb-6 max-w-3xl">
                {post.cta.body}
              </p>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                {post.cta.links.map((link) => (
                  <ActionLink
                    key={`${link.label}-${link.href}`}
                    className="inline-flex items-center gap-2 bg-white border-2 border-black px-5 py-3 font-bold text-sm uppercase hover:bg-black hover:text-white transition-colors"
                    link={link}
                  />
                ))}
              </div>
            </section>
          </article>
        </section>
      </main>
      <Footer />
    </>
  );
}
