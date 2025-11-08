// resources/js/Pages/Articles/Index.tsx
import HomeLayout from '@/layouts/home-layout';
import type { ArticlesPageProps } from '@/types/home';
import { Link } from '@inertiajs/react';

export default function ArticlesIndex(props: ArticlesPageProps) {
    return (
        <HomeLayout title="Artikel" navItems={props.navItems}>
            <section className="mx-auto max-w-6xl px-6 py-16">
                <h1 className="text-3xl font-bold mb-8">Artikel</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {props.articles.data.map(a => (
                        <article key={a.id} className="rounded-xl border bg-white p-4 shadow-sm">
                            {a.cover && <img src={a.cover} alt={a.title} className="rounded-lg mb-3 object-cover w-full h-40" loading="lazy" />}
                            <h2 className="text-lg font-semibold mb-2">{a.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-3">{a.excerpt}</p>
                            <Link href={`/articles/${a.slug}`} className="text-[#266055] font-medium mt-3 inline-block">Baca selengkapnya →</Link>
                        </article>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex items-center gap-3">
                    {props.articles.current_page > 1 && (
                        <Link href={`/articles?page=${props.articles.current_page - 1}`} className="px-3 py-2 border rounded">Sebelumnya</Link>
                    )}
                    {props.articles.current_page < props.articles.last_page && (
                        <Link href={`/articles?page=${props.articles.current_page + 1}`} className="px-3 py-2 border rounded">Berikutnya</Link>
                    )}
                </div>
            </section>
        </HomeLayout>
    );
}
