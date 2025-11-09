import HomeLayout from '@/layouts/home-layout';
import type { AboutPageProps } from '@/types/home';
import { Hero } from '@/components/home/hero';

export default function AboutIndex(props: AboutPageProps) {
    return (
        <HomeLayout title="Tentang" navItems={props.navItems }
            hero={{
                size: 'half',
                bg: { imageUrl: '/images/bg-hero.png', overlay: 'bg-gradient-to-b from-black/60 via-black/40 to-black/70' },
                content: (
                    <Hero
                        title={`Tentang Kami`}
                        showPills={false}
                    />
                ),
                }}>
            <section className="mx-auto max-w-5xl px-6 py-16">

            </section>
        </HomeLayout>
    );
}
