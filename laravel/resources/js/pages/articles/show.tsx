// resources/js/Pages/Articles/Show.tsx
'use client';

import HomeLayout from '@/layouts/home-layout';
import type { ArticlesPageProps } from '@/types/home';
import { Head, Link } from '@inertiajs/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Calendar, Clock, FolderOpen, User, ExternalLink, ArrowLeft } from 'lucide-react';
import { Hero } from '@/components/home/hero';

// =====================
// Types (sesuaikan dengan payload dari controller)
// =====================
type Reference = {
  id: number;
  source: string;
  title: string;
  author?: string;
  url: string;
  accessedAt: string; // ISO
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
  body: string[];      // controller mengirim array paragraf pada dummy
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
// Page Component
// =====================
export default function ArticleShow(props: ArticleShowProps) {
  const { article, navItems } = props;

  // progress bar saat scroll
  const [progress, setProgress] = useState(0); // 0 - 100

  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const pct =
        docHeight > 0
          ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
          : 0;
      setProgress(pct);
    };

    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', handler);
    };
  }, []);

  // breadcrumbs sederhana
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
        content: <Hero className="md:mt-10" title={article.title} showPills={false} />,
      }}
    >
      <Head title={article.title}>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
      </Head>

      <div className="fixed inset-x-0 top-0 z-[1101] h-2 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/60 transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <section className="mx-auto max-w-4xl px-6 pt-8 pb-16 lg:pt-12">
        {/* Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {breadcrumbs.map((bc, i) => (
            <span key={bc.href} className="flex items-center gap-2">
              <Link href={bc.href} className="hover:text-primary">
                {bc.label}
              </Link>
              {i < breadcrumbs.length - 1 && (
                <span className="text-gray-400">/</span>
              )}
            </span>
          ))}
        </nav>

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
          <LazyImage
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Body */}
        <article className="prose prose-gray max-w-none prose-p:leading-relaxed prose-headings:scroll-mt-20">
          {Array.isArray(article.body) ? (
            article.body.map((p, idx) => <p key={idx}>{p}</p>)
          ) : (
            // fallback kalau suatu saat body jadi string HTML
            <div dangerouslySetInnerHTML={{ __html: String(article.body) }} />
          )}
        </article>

        {/* References */}
        {Array.isArray(article.references) && article.references.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-[#1b1b18]">
              Referensi Sumber
            </h2>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      #
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Sumber
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Judul
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Penulis
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Tautan
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">
                      Diakses
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {article.references.map((ref, i) => (
                    <tr key={ref.id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3 text-gray-600">{i + 1}</td>
                      <td className="px-4 py-3 text-gray-900">{ref.source}</td>
                      <td className="px-4 py-3 text-gray-700">{ref.title}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {ref.author || '-'}
                      </td>
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
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(ref.accessedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              *Kami menampilkan referensi untuk memastikan konten terverifikasi
              dan mengurangi risiko penyebaran hoaks.
            </p>
          </section>
        )}

        {/* Footer back link */}
        <div className="mt-10 flex items-center justify-between border-t pt-6">
          <Link
            href="/articles"
            className="text-sm font-medium text-primary hover:underline"
          >
            ← Kembali ke daftar artikel
          </Link>
        </div>
      </section>
    </HomeLayout>
  );
}
