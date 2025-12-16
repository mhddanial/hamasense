'use client';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import { Hero } from '@/components/home/hero';
import HomeLayout from '@/layouts/home-layout';
import type { ArticlesPageProps } from '@/types/home';
import { Article } from '@/types/article';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';


// ---------------------
// Types
// ---------------------
interface ArticlesPagePropsExtended extends Omit<ArticlesPageProps, 'articles'> {
    articles?: Article[];
}


// ---------------------
// DUMMY DATA (contoh)
// ---------------------
const DUMMY_ARTICLES: Article[] = [
  // {
  //   id: 1,
  //   title: 'Mengenal Gejala Awal Serangan Ulat Grayak pada Jagung',
  //   slug: 'gejala-awal-ulat-grayak',
  //   excerpt:
  //     'Pelajari ciri-ciri serangan ulat grayak sejak dini agar mitigasi bisa dilakukan lebih cepat.',
  //   category: 'Hama',
  //   author: 'Tim HAMASENSE',
  //   date: '2025-10-15',
  //   image: '/images/maize_armyworm.jpg',
  //   readingTime: '5 menit',
  //   views: 1540,
  // },
];


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

const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!imgRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
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

export default function ArticlesIndex(props: ArticlesPagePropsExtended) {
  // State search & filter
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  // derive categories dari data
  const allArticles = useMemo(() => {
    const dynamicArticles = props.articles || [];
    // Merge dummy + dynamic
    // "add the latest version below the original code" -> merge them.
    return [...DUMMY_ARTICLES, ...dynamicArticles];
  }, [props.articles]);

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(allArticles.map((a) => a.category)))],
    [allArticles]
  );

  // filter & sort
  const filteredArticles = useMemo(() => {
    let list = [...allArticles];

    if (q.trim()) {
      const qq = q.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(qq) ||
          a.excerpt.toLowerCase().includes(qq) ||
          a.category.toLowerCase().includes(qq)
      );
    }

    if (category !== 'all') {
      list = list.filter((a) => a.category === category);
    }

    if (sortBy === 'newest') {
      list.sort((a, b) => +new Date(b.date) - +new Date(a.date));
    } else {
      list.sort((a, b) => b.views - a.views);
    }

    return list;
  }, [q, category, sortBy]);

  // top 5 berdasarkan views (display tanpa angka views)
  const topFive = useMemo(
    () => [...allArticles].sort((a, b) => b.views - a.views).slice(0, 5),
    [allArticles]
  );

  return (
    <HomeLayout
      title="Jelajahi Artikel"
      navItems={props.navItems}
      hero={{
        size: 'half',
        bg: {
          imageUrl: '/images/bg-hero.png',
          overlay: 'bg-gradient-to-b from-black/60 via-black/40 to-black/70',
        },
        content: <Hero className="md:mt-10" title={`Jelajahi Artikel`} showPills={false} />,
      }}
    >
      <section className="mx-auto max-w-6xl px-6 py-10 lg:py-16">
        {/* Toolbar: Search + Filters (tags removed) */}
        <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari artikel…"
            className="col-span-2 rounded-lg border border-gray-200 px-4 py-2 text-[15px] outline-none focus:border-gray-400 md:text-base"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-[15px] outline-none focus:border-gray-400 md:text-base"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'Semua Kategori' : c}
              </option>
            ))}
          </select>
          <div className="md:col-span-1 -mt-1 flex flex-wrap items-center gap-3">
            <label className="text-xs text-gray-500 md:text-sm">Urutkan:</label>
            <button
              className={cn(
                'rounded-full px-3 py-1.5 text-xs md:px-4 md:text-sm',
                sortBy === 'newest'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              onClick={() => setSortBy('newest')}
            >
              Terbaru
            </button>
            <button
              className={cn(
                'rounded-full px-3 py-1.5 text-xs md:px-4 md:text-sm',
                sortBy === 'popular'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              onClick={() => setSortBy('popular')}
            >
              Terpopuler
            </button>
          </div>
        </div>

        {/* Layout: Grid + Sidebar */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Grid artikel */}
          <div className="lg:col-span-8">
            {filteredArticles.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
                Tidak ada artikel yang cocok.
              </div>
            ) : (
              // 3 kolom pada desktop
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((a) => (
                  <article
                    key={a.id}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                  >
                    <Link href={`/articles/${a.slug}`}>
                        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                            <LazyImage
                                src={a.image}
                                alt={a.title}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-4">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary md:text-xs">
                                    {a.category}
                                </span>                          
                            </div>
                            <h3 className="mb-2 line-clamp-2 text-base font-bold text-gray-900">
                                {a.title}
                            </h3>
                            <p className="mb-1 line-clamp-2 text-[13px] text-gray-600">
                                {a.excerpt}
                            </p>
                            <span className="text-[11px] text-gray-500 md:text-xs">{formatDate(a.date)}</span>
                        </div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Top 5 */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h4 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 md:text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Artikel Populer
                </h4>
              <ul className="space-y-4">
                {topFive.map((a) => (
                  <li key={a.id} className="flex items-center gap-3">
                    {/* Thumbnail kecil */}
                    <Link href={`/articles/${a.slug}`} className="group flex min-w-0 flex-1 items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                        <LazyImage
                          src={a.image}
                          alt={a.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="line-clamp-2 text-sm font-semibold text-gray-800 group-hover:text-primary md:text-[15px]">
                          {a.title}
                        </div>
                        <div className="mt-0.5 text-[11px] text-gray-500 md:text-xs">
                          {formatDate(a.date)}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </HomeLayout>
  );
}
