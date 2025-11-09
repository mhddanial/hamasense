// resources/js/Pages/About/Index.tsx
import HomeLayout from '@/layouts/home-layout';
import type { AboutPageProps } from '@/types/home';

export default function AboutIndex(props: AboutPageProps) {
    return (
        <HomeLayout title="Tentang" navItems={props.navItems}>
            <section className="mx-auto max-w-5xl px-6 py-16">
                <h1 className="text-3xl font-bold mb-2">{props.hero.title}</h1>
                <p className="text-gray-600 mb-8">{props.hero.subtitle}</p>

                <div className="space-y-8">
                {props.sections.map((s, i) => (
                    <div key={i}>
                    <h2 className="text-xl font-semibold mb-2">{s.title}</h2>
                    <p className="text-gray-700">{s.body}</p>
                    </div>
                ))}
                </div>
            </section>
        </HomeLayout>
    );
}
