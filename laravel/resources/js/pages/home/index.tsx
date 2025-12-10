'use client';
import HomeLayout from '@/layouts/home-layout';
import type { HomePageProps } from '@/types/home';
import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import { Hero } from '@/components/home/hero';
import { WhyUs } from '@/components/home/why-us';
import { HowItWorks } from '@/components/home/how-it-works';
import { DetectionExamples } from '@/components/home/detect-examples';
import { Testimonials } from '@/components/home/testimonials';
import { Faq } from '@/components/home/faq';

export default function HomeIndex(props: HomePageProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <HomeLayout
            title="Selamat Datang di HAMASENSE"
            navItems={props.navItems}
            hero={{
                size: 'full',
                bg: { imageUrl: '/images/bg-hero.png', overlay: 'bg-gradient-to-b from-black/60 via-black/40 to-black/70' },
                content: (
                <Hero
                    title={`Lindungi Tanaman Anda Bersama <span class='font-bold font-logo md:text-6xl'>HAMASENSE</span>`}
                    subtitle="Lindungi tanaman Anda dengan teknologi AI terdepan. Deteksi hama dalam sekali klik dan dapatkan solusi perawatan yang tepat."
                />
                ),
            }}
            >
            <WhyUs features={props.features} />
            <HowItWorks />
            <DetectionExamples examples={props.detectionExamples} />
            <Testimonials />
            <Faq items={props.faqs} />
        </HomeLayout>
    );
}
