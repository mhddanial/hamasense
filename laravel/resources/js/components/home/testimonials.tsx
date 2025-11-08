'use client'

import { AnimatedTestimonials } from '@/components/ui/animated-testimonials'

export type Testimonial = {
    quote: string
    name: string
    designation: string
    src: string
    rating: number
}

export function Testimonials({
    testimonials = [
        {
            quote: 'Aplikasinya benar-benar membantu! Deteksi hama jadi jauh lebih cepat dan hasil panen meningkat karena penanganan bisa dilakukan lebih dini.',
            name: 'Rina Putri',
            designation: 'Petani Tomat — Malang',
            src: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3',
            rating: 5,
        },
        {
            quote: 'Fitur komunitasnya luar biasa, saya bisa berbagi pengalaman dengan petani lain. Sekarang lebih mudah mengenali dan mengatasi serangan hama.',
            name: 'Budi Santoso',
            designation: 'Pekebun Cabai — Garut',
            src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
            rating: 5,
        },
        {
            quote: 'Sebagai penghobi urban farming, fitur prediksi cuaca dan deteksi otomatis benar-benar memudahkan saya merawat tanaman di rumah.',
            name: 'Lestari Dewi',
            designation: 'Pecinta Tanaman — Jakarta',
            src: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3',
            rating: 4,
        },
        {
            quote: 'HAMASENSE memberi solusi lengkap, mulai dari deteksi hingga rekomendasi perawatan. Kini komunitas kami lebih cepat menangani serangan hama.',
            name: 'Rahman Hidayat',
            designation: 'Anggota Komunitas Tani — Yogyakarta',
            src: 'https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3',
            rating: 5,
        },
        {
            quote: 'Sistemnya cerdas dan mudah digunakan. Hasil deteksinya akurat dan membuat proses perawatan tanaman jadi lebih efisien.',
            name: 'Siti Marlina',
            designation: 'Petani Sayur Hidroponik — Bandung',
            src: 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3',
            rating: 4,
        },
    ],
    autoplay = true,
}: {
    testimonials?: Testimonial[]
    autoplay?: boolean
}) {
    return (
        <section className="relative bg-[#FDFDFC] md:py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
            <p className="mb-3 text-md font-bold uppercase tracking-wider text-[#266055]">Testimoni Pengguna</p>
            <h2 className="text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
            Apa Kata Mereka Tentang <span className="font-logo">HAMASENSE</span>
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
            Cerita nyata dari petani dan pecinta tanaman yang telah merasakan manfaat teknologi aplikasi kami
            </p>
        </div>
        <div className="z-0 bg-[#FDFDFC]">
            <AnimatedTestimonials testimonials={testimonials} autoplay={autoplay} />
        </div>
        </section>
    )
}