// resources/js/Pages/Articles/Show.tsx
'use client';

import HomeLayout from '@/layouts/home-layout';
import type { ArticlesPageProps } from '@/types/home';
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, Clock, FolderOpen, User, ExternalLink, Facebook, MessageCircle, Link2, Check, Share2 } from 'lucide-react';
import { Hero } from '@/components/home/hero';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';



type Reference = {
  source_name: string;
  url: string;
};

type ArticleShow = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;        // ISO
  image: string;
  readingTime: string; // contoh: "6 menit"
  body: string | string[];  // can be string (from DB) or array
  references: Reference[];
};

type ArticleShowProps = {
  navItems: ArticlesPageProps['navItems'];
  article: ArticleShow;
};

// =====================
// Utils
// =====================
function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({
  src,
  alt,
  className,
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!imgRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={inView ? src : undefined}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
};

// =====================
// Social Share Component
// =====================
function SocialShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    // Instagram doesn't have a direct share URL, so we'll use the copy link feature
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link berhasil disalin!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Gagal menyalin link');
    }
  };

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600 flex items-center gap-1">
        <Share2 className="h-4 w-4" />
        Bagikan:
      </span>

      {/* Facebook */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareLinks.facebook)}
        className="h-9 w-9 p-0 rounded-full bg-blue-600 hover:bg-blue-700 border-0 text-white hover:text-white"
        title="Bagikan ke Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      {/* WhatsApp */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => openShareWindow(shareLinks.whatsapp)}
        className="h-9 w-9 p-0 rounded-full bg-green-500 hover:bg-green-600 border-0 text-white hover:text-white"
        title="Bagikan ke WhatsApp"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>

      {/* Instagram - Copy link (Instagram doesn't support direct URL sharing) */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="h-9 w-9 p-0 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 border-0 text-white hover:text-white"
        title="Salin link untuk Instagram"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      </Button>

      {/* Copy Link */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className={`h-9 px-3 rounded-full gap-1.5 ${copied ? 'bg-green-100 text-green-700 border-green-200' : ''}`}
        title="Salin link"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            <span className="text-xs">Disalin!</span>
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" />
            <span className="text-xs">Salin Link</span>
          </>
        )}
      </Button>
    </div>
  );
}

// =====================
// Page Component
// =====================
export default function ArticleShow(props: ArticleShowProps) {
  const { article, navItems } = props;

  // Get current URL for sharing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // ===== Smooth scroll progress (requestAnimationFrame + transform scaleX) =====
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const ratio = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;

      if (progressRef.current) {
        // Gunakan transform agar GPU-accelerated dan halus
        progressRef.current.style.transform = `scaleX(${ratio})`;
      }
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    // init
    update();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  // breadcrumbs (pakai shadcn)
  const breadcrumbs = useMemo(
    () => [
      { href: '/articles', label: 'Artikel' },
      { href: `/articles/${article.slug}`, label: article.title },
    ],
    [article.slug, article.title]
  );

  return (
    <HomeLayout
      title={article.title}
      navItems={navItems}
      hero={{
        size: 'half',
        bg: {
          imageUrl: '/images/bg-hero.png',
          overlay: 'bg-gradient-to-b from-black/60 via-black/40 to-black/70',
        },
        content: <Hero className="md:pt-36" title={article.title} showPills={false} />,
      }}
    >
      <Head title={article.title}>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
      </Head>

      {/* Progress bar fix di atas navbar (z lebih tinggi) */}
      <div className="fixed inset-x-0 top-0 z-[1101] h-1 bg-transparent">
        <div
          ref={progressRef}
          className="h-full origin-left bg-gradient-to-r from-primary to-primary/60 will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      <section className="mx-auto max-w-4xl px-6 pt-8 pb-16 lg:pt-12">
        {/* Breadcrumbs (shadcn) */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={breadcrumbs[0].href}>{breadcrumbs[0].label}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumbs[1].label}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Header */}
        <header className="mb-6">
          <h1 className="mb-3 text-2xl font-bold leading-tight text-[#1b1b18] sm:text-3xl">
            {article.title}
          </h1>
          <p className="mb-4 text-gray-600">{article.excerpt}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              {article.category}
            </span>
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4" />
              {article.author}
            </span>
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(article.date)}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {article.readingTime}
            </span>
          </div>
        </header>

        {/* Cover */}
        <div className="mb-8 overflow-hidden rounded-2xl bg-gray-100">
          <LazyImage src={article.image} alt={article.title} className="h-full w-full object-cover" />
        </div>

        {/* Body - Render HTML content properly */}
        <article className="prose prose-gray max-w-none prose-p:leading-relaxed prose-headings:scroll-mt-20 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-h3:text-xl prose-h3:font-semibold prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic">
          {Array.isArray(article.body) ? (
            article.body.map((p, idx) => <p key={idx}>{p}</p>)
          ) : (
            // Render HTML content from rich text editor
            <div dangerouslySetInnerHTML={{ __html: String(article.body) }} />
          )}
        </article>

        {/* Social Share Buttons */}
        <div className="mt-8 py-6 border-t border-b border-gray-200">
          <SocialShareButtons title={article.title} url={currentUrl || `/articles/${article.slug}`} />
        </div>

        {/* References */}
        {Array.isArray(article.references) && article.references.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-[#1b1b18]">Referensi Sumber</h2>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Sumber</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Tautan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {article.references.map((ref, i) => (
                    <tr key={i} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3 text-gray-600">{i + 1}</td>
                      <td className="px-4 py-3 text-gray-900">{ref.source_name}</td>
                      <td className="px-4 py-3">
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
                        >
                          Kunjungi <ExternalLink className="h-4 w-4" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              *Kami menampilkan referensi untuk memastikan konten terverifikasi dan mengurangi risiko penyebaran hoaks.
            </p>
          </section>
        )}

        {/* Footer back link */}
        <div className="mt-10 flex items-center justify-between border-t pt-6">
          <Link href="/articles" className="text-sm font-medium text-primary hover:underline">
            ← Kembali ke daftar artikel
          </Link>
        </div>
      </section>
    </HomeLayout>
  );
}
