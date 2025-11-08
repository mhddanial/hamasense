'use client';
import { dashboard, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { UserMenuContent } from '@/components/user-menu-content';
import AppLogo from '@/components/app-logo';
import { Check, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/navbar";
import { useState } from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import Footer from '@/components/ui/footer';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const getInitials = useInitials();
    const navItems = [
        {
            name: "Beranda",
            link: "/",
        },
        {
            name: "Tentang",
            link: "/about",
        },
        {
            name: "Artikel",
            link: "/articles",
        },
    ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    "Deteksi hama instan hanya dalam hitungan detik",
    "Solusi perawatan tanaman berkelanjutan tersedia untuk dijelajahi",
    "Prediksi cuaca untuk meningkatkan kualitas tanaman",
    "Dilengkapi dengan fitur komunitas untuk membantu sesama"
  ];

    type DetectionExample = {
        id: number;
        plantName: string;
        disease: string;
        severity: 'Rendah' | 'Sedang' | 'Tinggi';
        confidence: number;
        description: string;
        symptoms: string[];
        treatment: string[];
        prevention: string[];
        image: string;
    };

    const detectionExamples: DetectionExample[] = [
        {
            id: 1,
            plantName: 'Tomat',
            disease: 'Busuk Daun (Late Blight)',
            severity: 'Tinggi',
            confidence: 92,
            description: 'Bercak coklat gelap pada daun, cepat menyebar saat lembab.',
            symptoms: ['Bercak coklat pada daun', 'Tepi daun mengering', 'Buah membusuk'],
            treatment: ['Gunakan fungisida berbasis tembaga', 'Perbaiki sirkulasi udara', 'Hindari penyiraman dari atas'],
            prevention: ['Rotasi tanaman', 'Pilih varietas tahan penyakit', 'Bersihkan sisa tanaman sakit'],
            image: '/images/tomato_late_blight.jpg'
        },
        {
            id: 2,
            plantName: "Cabai",
            disease: "Bercak Bakteri (Bacterial Spot)",
            severity: "Sedang",
            confidence: 92,
            description: "Infeksi bakteri yang menyebabkan bercak basah pada daun dan buah, seringkali membuatnya rontok.",
            symptoms: [
                "Bercak kecil basah (water-soaked) pada daun",
                "Bercak menjadi gelap, kering, dan berkerak",
                "Daun menguning dan rontok sebelum waktunya"
            ],
            treatment: [
                "Semprotkan bakterisida (berbahan tembaga)",
                "Buang dan musnahkan bagian tanaman yang terinfeksi",
                "Kurangi penyiraman dari atas (overhead watering)"
            ],
            prevention: [
                "Gunakan benih atau bibit yang sehat (bersertifikat)",
                "Lakukan rotasi tanaman (jangan tanam cabai/tomat berurutan)",
                "Jaga jarak tanam agar sirkulasi udara baik"
            ],
            image: "/images/pepper_bell_bacterial_spot.jpg"
        },
        {
            id: 3,
            plantName: "Singkong",
            disease: "Tungau Hijau (Cassava Green Mite)",
            severity: "Sedang",
            confidence: 88,
            description: "Hama tungau kecil yang menyerang tunas dan daun muda, menghisap cairan sel dan menyebabkan kerusakan.",
            symptoms: [
                "Daun muda menguning atau berbintik kuning (klorosis)",
                "Bentuk daun tidak normal atau keriting",
                "Pertumbuhan tanaman kerdil atau tunas terhambat"
            ],
            treatment: [
                "Semprotkan akarisida (pembasmi tungau) yang efektif",
                "Lepaskan musuh alami (tungau predator)",
                "Gunakan sabun insektisida atau minyak nimba"
            ],
            prevention: [
                "Tanam varietas singkong yang tahan hama",
                "Gunakan bibit yang sehat dan bebas tungau",
                "Lakukan sanitasi kebun (membersihkan gulma)"
            ],
            image: "/images/cassava_green_mite.jpg"
        },
        {
            id: 4,
            plantName: 'Jagung',
            disease: 'Ulat Grayak (Armyworm)',
            severity: 'Sedang',
            confidence: 80,
            description: 'Larva memakan daun meninggalkan lubang tidak beraturan.',
            symptoms: ['Daun berlubang', 'Kotoran ulat pada daun', 'Kerusakan cepat meluas'],
            treatment: ['PoTrap feromon', 'Ambil manual ulat', 'Gunakan BT (Bacillus thuringiensis)'],
            prevention: ['Pasang perangkap lampu', 'Bersihkan gulma sekitar', 'Rotasi tanaman'],
            image: '/images/maize_armyworm.jpg'
        }
    ];

    const [selectedExample, setSelectedExample] = useState<number | null>(null);

    function getSeverityColor(severity: DetectionExample['severity']): string {
        switch (severity) {
        case 'Tinggi':
            return 'border-red-300 text-red-700';
        case 'Sedang':
            return 'border-yellow-300 text-yellow-700';
        case 'Rendah':
        default:
            return 'border-green-300 text-green-700';
        }
    }

    type Faq = { q: string; a: string };

    const faqs: Faq[] = [
        {
            q: "Bagaimana cara kerja HAMASENSE dalam mendeteksi hama?",
            a: "Anda cukup ambil atau unggah foto tanaman. Model AI kami akan menganalisis pola pada daun, batang, dan buah untuk mengidentifikasi jenis hama/penyakit lalu menampilkan tingkat keyakinan dan rekomendasi penanganan.",
        },
        {
            q: "Seberapa akurat deteksinya?",
            a: "Akurasi rata-rata tinggi pada komoditas populer (tomat, cabai, pisang, jagung, singkong), namun tetap dipengaruhi kualitas foto, pencahayaan, dan sudut pengambilan. Kami menampilkan skor keyakinan agar Anda bisa menilai hasilnya.",
        },
        {
            q: "Apakah data dan foto saya disimpan?",
            a: "Secara default, kami hanya menyimpan data yang diperlukan untuk meningkatkan kualitas model dan pengalaman pengguna. Anda dapat menghapus riwayat deteksi kapan saja dari dashboard dan mengatur preferensi privasi.",
        },
        {
            q: "Apakah aplikasi bisa digunakan tanpa internet?",
            a: "Model berjalan di server sehingga koneksi internet diperlukan untuk analisis. Namun, Anda tetap bisa memotret lalu mengunggah saat koneksi tersedia.",
        },
        {
            q: "Tanaman apa saja yang didukung?",
            a: "Saat ini fokus pada tomat, cabai, pisang, jagung, dan singkong. Dukungan tanaman lain akan ditambahkan bertahap. Anda bisa mengajukan permintaan tanaman baru melalui menu Masukan.",
        },
        {
            q: "Bagaimana jika hasil deteksi tidak sesuai?",
            a: "Coba unggah foto yang lebih tajam/terang atau dari sudut berbeda. Anda juga dapat membandingkan dengan contoh gejala, atau bertanya di Komunitas untuk verifikasi dari pengguna lain.",
        },
        {
            q: "Apakah ada rekomendasi penanganan yang ramah lingkungan?",
            a: "Ya. Kami menampilkan opsi organik dan praktik budidaya berkelanjutan (sanitasi, rotasi, jarak tanam, predator alami) selain opsi kimia yang lazim.",
        },
        {
            q: "Bagaimana cara menghubungi dukungan?",
            a: "Gunakan menu Bantuan di aplikasi atau kirim email ke hamasense.app@gmail.com Sertakan foto/gejala serta waktu kejadian agar tim kami bisa membantu lebih cepat.",
        },
    ];


    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="relative min-h-screen bg-[#FDFDFC]">
                {/* Hero Background */}
                <div className="absolute inset-0 z-0">
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: "url('/images/bg-hero.png')",
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex min-h-screen flex-col">
                    {/* Navbar */}
                    <div className="w-full p-6 lg:p-8">
                        <Navbar>
                            {/* Desktop Navigation */}
                            <NavBody>
                                <NavbarLogo />
                                <NavItems items={navItems} />
                                <div className="flex items-center gap-4">
                                    {auth.user ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="size-10 rounded-full p-1 hover:bg-white/10"
                                                >
                                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black">
                                                            {getInitials(auth.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56" align="end">
                                                <DropdownMenuSeparator />
                                                <UserMenuContent user={auth.user} />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <>
                                            <NavbarButton
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                variant="primary"
                                                className="w-full bg-white text-slate-600 hover:bg-white/90"
                                                href='/login'
                                                cta='register'
                                                >
                                                Login / Registrasi
                                            </NavbarButton>
                                        </>
                                    )}
                                </div>
                            </NavBody>

                            {/* Mobile Navigation */}
                            <MobileNav>
                                <MobileNavHeader>
                                    <NavbarLogo />
                                    <MobileNavToggle
                                        isOpen={isMobileMenuOpen}
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    />
                                </MobileNavHeader>

                                <MobileNavMenu
                                    isOpen={isMobileMenuOpen}
                                    onClose={() => setIsMobileMenuOpen(false)}
                                >
                                {navItems.map((item, idx) => (
                                    <a
                                        key={`mobile-link-${idx}`}
                                        href={item.link}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="relative text-black/100"
                                    >
                                        <span className="block">{item.name}</span>
                                    </a>
                                ))}
                                <div className="flex w-full flex-col gap-4">
                                    {auth.user ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="justify-start gap-3 rounded-lg border border-white/20 px-4 py-2 text-left text-black/100"
                                                >
                                                    <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black">
                                                            {getInitials(auth.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="truncate">{auth.user.name}</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="w-56" align="start">
                                                <DropdownMenuLabel className="p-2">
                                                    <div className="flex items-center gap-2">
                                                        <AppLogo />
                                                    </div>
                                                </DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <UserMenuContent user={auth.user} />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <>
                                            <NavbarButton
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                variant="primary"
                                                className="w-full bg-white text-[#1b1b18] hover:bg-white/90"
                                                href='/login'
                                                cta='register'
                                                >
                                                Masuk / Registrasi
                                            </NavbarButton>
                                        </>
                                    )}
                                </div>
                                </MobileNavMenu>
                            </MobileNav>
                        </Navbar>
                    </div>
                    {/* Hero Section */}
                    <div className="flex flex-1 items-center justify-center px-6 py-20 lg:px-8">
                        <div className="max-w-5xl text-center">
                            <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                                Lindungi Tanaman Anda Bersama <span className='truncate leading-tight font-bold font-logo'>HAMASENSE</span>
                            </h1>
                            <p className="mx-auto mb-10 max-w-2xl text-md leading-relaxed text-white/90 sm:text-xl">
                                Lindungi tanaman Anda dengan teknologi AI terdepan. Deteksi hama dalam sekali klik dan dapatkan solusi perawatan yang tepat untuk hasil pengalaman berkebun yang lebih baik
                            </p>
                            {/* Features Pills */}
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                                    ✓ Deteksi Real-time
                                </div>
                                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                                    ✓ Akurasi Tinggi
                                </div>
                                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                                    ✓ Mudah Digunakan
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-35 bg-gradient-to-t from-[#FDFDFC]/50 to-transparent"></div>
                </div>
            </div>
            <section className="relative bg-[#FDFDFC]">
                <div className="pointer-events-none absolute -top-8 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-[#FDFDFC]" />
                <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
                        {/* Left: Image with accent border */}
                        <div className="relative">
                            <div className="relative overflow-hidden rounded-3xl">
                                <div className="aspect-[4/3] w-full">
                                    <img
                                        src="/images/why-choose-us.png"
                                        alt="Ilustrasi tanaman rusak karena hama"
                                        className="h-full w-full rounded-3xl object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right: Title & Features List */}
                        <div className="space-y-8">
                            <div>
                                <p className="mb-3 text-md font-bold uppercase tracking-wider text-[#266055]">
                                MENGAPA HAMASENSE
                                </p>
                                <h2 className="text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
                                Fitur Cerdas Untuk Anda Sebagai Asisten Merawat Tanaman
                                </h2>
                            </div>

                            <ul className="space-y-6">
                                {features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-4">
                                    <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#266055]">
                                    <Check className="h-3.5 w-3.5 text-[#266055]" strokeWidth={3} />
                                    </div>
                                    <p className="text-md leading-relaxed text-black">{feature}</p>
                                </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative bg-white py-16 lg:py-16">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="mb-16 text-center">
                        <p className="mb-3 text-md font-bold uppercase tracking-wider text-[#266055]">
                            CARA KERJA
                        </p>
                        <h2 className="text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
                            Proses Cepat Dalam 3 Langkah Mudah
                        </h2>
                    </div>

                    {/* Steps Container */}
                    <div className="relative text-center sm:text-left">
                        {/* Vertical Line - Hidden on mobile */}
                        <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#266055] via-[#266055] to-[#266055]/30 md:block" />

                        {/* Steps */}
                        <div className="space-y-16 md:space-y-24">
                            {/* Step 1 */}
                            <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                                {/* Left Content */}
                                <div className="order-2 md:order-1 md:text-right">
                                    <div className="inline-block rounded-2xl bg-gradient-to-br from-[#266055]/5 to-[#266055]/10 p-8 backdrop-blur-sm">
                                        <div className="mb-4 inline-block rounded-xl bg-white p-4 shadow-lg">
                                            <img
                                                src="/icons/take-a-photo.svg"
                                                alt="Ambil atau Upload Foto"
                                                className="h-16 w-16 object-contain"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Center Circle */}
                                <div className="absolute left-1/2 top-1/2 z-5 hidden -translate-x-1/2 -translate-y-1/2 md:block">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#266055] shadow-lg ring-4 ring-white">
                                        <span className="text-xl font-bold text-white">01</span>
                                    </div>
                                </div>

                                {/* Right Content */}
                                <div className="order-1 md:order-2">
                                    <div className="md:pl-8">
                                        {/* Mobile Circle */}
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#266055] md:hidden">
                                            <span className="text-lg font-bold text-white">01</span>
                                        </div>
                                        <h3 className="mb-3 text-2xl font-bold text-[#1b1b18]">
                                            Ambil atau Upload Foto
                                        </h3>
                                        <p className="text-md leading-relaxed text-gray-600">
                                            Ambil foto tanaman Anda yang terkena hama atau upload gambar dari galeri. Pastikan foto jelas dan fokus pada bagian yang bermasalah untuk hasil deteksi yang optimal.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                                <div className="order-1 md:text-right">
                                    <div className="md:pr-8">
                                        {/* Mobile Circle */}
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#266055] md:hidden">
                                            <span className="text-lg font-bold text-white">02</span>
                                        </div>
                                        <h3 className="mb-3 text-2xl font-bold text-[#1b1b18]">
                                            Analisis AI
                                        </h3>
                                        <p className="text-md leading-relaxed text-gray-600">
                                            Sistem AI kami akan menganalisis foto tanaman Anda secara otomatis dalam hitungan detik. Teknologi machine learning canggih mengidentifikasi jenis hama dengan akurasi tinggi.
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 top-1/2 z-5 hidden -translate-x-1/2 -translate-y-1/2 md:block">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#266055] shadow-lg ring-4 ring-white">
                                        <span className="text-xl font-bold text-white">02</span>
                                    </div>
                                </div>
                                <div className="order-2">
                                    <div className="inline-block rounded-2xl bg-gradient-to-br from-[#266055]/5 to-[#266055]/10 p-8 backdrop-blur-sm">
                                        <div className="mb-4 inline-block rounded-xl bg-white p-4 shadow-lg">
                                            <img
                                                src="/icons/ai-analysis.svg"
                                                alt="Analisis AI"
                                                className="h-16 w-16 object-contain"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2">
                                <div className="order-2 md:order-1 md:text-right">
                                    <div className="inline-block rounded-2xl bg-gradient-to-br from-[#266055]/5 to-[#266055]/10 p-8 backdrop-blur-sm">
                                        <div className="mb-4 inline-block rounded-xl bg-white p-4 shadow-lg">
                                            <img
                                                src="/icons/get-solution.svg"
                                                alt="Dapatkan Solusi"
                                                className="h-16 w-16 object-contain"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute left-1/2 top-1/2 z-5 hidden -translate-x-1/2 -translate-y-1/2 md:block">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#266055] shadow-lg ring-4 ring-white">
                                        <span className="text-xl font-bold text-white">03</span>
                                    </div>
                                </div>
                                <div className="order-1 md:order-2">
                                    <div className="md:pl-8">
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#266055] md:hidden">
                                            <span className="text-lg font-bold text-white">03</span>
                                        </div>
                                        <h3 className="mb-3 text-2xl font-bold text-[#1b1b18]">
                                            Dapatkan Solusi
                                        </h3>
                                        <p className="text-md leading-relaxed text-gray-600">
                                            Terima laporan lengkap tentang hama yang terdeteksi beserta rekomendasi perawatan yang tepat. Panduan langkah demi langkah untuk mengatasi masalah tanaman Anda.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-16 text-center">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#266055] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#1e4a41] hover:shadow-xl"
                            >
                                Mulai Sekarang
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        ) : (
                            <Link
                                href={dashboard()}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#266055] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#1e4a41] hover:shadow-xl"
                            >
                                Coba Gratis Sekarang
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Detection Examples Section */}
            <section className="relative bg-gradient-to-b from-white to-[#FDFDFC] py-16 lg:py-16">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
                            Lihat Hasil Deteksi AI Kami
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            Lihat contoh deteksi penyakit tanaman yang berhasil diidentifikasi oleh sistem AI kami dengan akurasi tinggi
                        </p>
                    </div>

                    {/* Examples Grid */}
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {detectionExamples.map((example, index) => (
                            <div
                                key={example.id}
                                onClick={() => setSelectedExample(index)}
                                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                    <img
                                        src={example.image}
                                        alt={`${example.plantName} - ${example.disease}`}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <Badge className="bg-white/90 text-[#266055] hover:bg-white">
                                            Klik untuk detail
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="mb-2 flex items-center justify-between">
                                        <h3 className="font-semibold text-[#1b1b18]">{example.plantName}</h3>
                                        <Badge variant="outline" className={getSeverityColor(example.severity)}>
                                            {example.severity}
                                        </Badge>
                                    </div>
                                    <p className="mb-3 text-sm text-gray-600 line-clamp-1">{example.disease}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 overflow-hidden rounded-full bg-gray-200">
                                            <div 
                                                className="h-1.5 rounded-full bg-[#266055] transition-all duration-500"
                                                style={{ width: `${example.confidence}%` }}
                                            />
                                        </div>
                                        <span className="text-sm font-semibold text-[#266055]">
                                            {example.confidence}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-600">
                            Ingin mencoba sendiri?{' '}
                            {auth.user ? (
                                <Link 
                                    href={dashboard()} 
                                    className="font-semibold text-[#266055] hover:underline"
                                >
                                    Mulai deteksi sekarang →
                                </Link>
                            ) : (
                                <Link 
                                    href={register()} 
                                    className="font-semibold text-[#266055] hover:underline"
                                >
                                    Daftar gratis sekarang →
                                </Link>
                            )}
                        </p>
                    </div>
                </div>
            </section>

            {/* Detection Detail Modal */}
            <Dialog open={selectedExample !== null} onOpenChange={() => setSelectedExample(null)}>
                <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
                    {selectedExample !== null && (
                    <>
                        <DialogHeader>
                        <div className="mb-4 flex items-start justify-start gap-4">
                            <div>
                                <DialogTitle className="text-xl md:text-2xl font-bold text-[#1b1b18] text-left">
                                    {detectionExamples[selectedExample].disease}
                                </DialogTitle>
                                <DialogDescription className="mt-2 text-base text-left">
                                    Tanaman: {detectionExamples[selectedExample].plantName}
                                </DialogDescription>
                            </div>
                            <Badge
                                variant="outline"
                                className={`${getSeverityColor(
                                    detectionExamples[selectedExample].severity
                                )} text-sm`}
                                >
                                {detectionExamples[selectedExample].severity}
                            </Badge>
                        </div>
                        </DialogHeader>

                        <div className="space-y-6">
                            {/* Gambar Deteksi */}
                            <div className="relative aspect-video overflow-hidden rounded-xl shadow-md">
                                <img
                                src={detectionExamples[selectedExample].image}
                                alt={`${detectionExamples[selectedExample].plantName} - ${detectionExamples[selectedExample].disease}`}
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent transition-opacity duration-300 opacity-100" />
                                <div className="absolute bottom-3 left-3 text-white drop-shadow-md">
                                    <p className="font-semibold">
                                        {detectionExamples[selectedExample].plantName}
                                    </p>
                                    <p className="text-sm opacity-90">
                                        {detectionExamples[selectedExample].disease}
                                    </p>
                                </div>
                            </div>

                            {/* Confidence Score */}
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="font-semibold text-gray-700">Tingkat Keyakinan AI</span>
                                    <span className="text-2xl font-bold text-[#266055]">
                                        {detectionExamples[selectedExample].confidence}%
                                    </span>
                                </div>
                                <div className="overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-3 rounded-full bg-gradient-to-r from-[#266055] to-[#1e4a41] transition-all duration-500"
                                        style={{ width: `${detectionExamples[selectedExample].confidence}%` }}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h4 className="mb-2 font-semibold text-gray-900">Deskripsi</h4>
                                <p className="text-gray-600">
                                    {detectionExamples[selectedExample].description}
                                </p>
                            </div>

                            {/* Symptoms */}
                            <div>
                                <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                                    Gejala yang Terlihat
                                </h4>
                                <ul className="space-y-2">
                                    {detectionExamples[selectedExample].symptoms.map((symptom, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-600">
                                            <div className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange-100">
                                                <div className="h-2 w-2 rounded-full bg-orange-500" />
                                            </div>
                                        <span>{symptom}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Treatment */}
                            <div className="rounded-lg bg-[#266055]/5 p-4">
                                <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                    <CheckCircle2 className="h-5 w-5 text-[#266055]" />
                                    Langkah Penanganan
                                </h4>
                                <ol className="space-y-3">
                                    {detectionExamples[selectedExample].treatment.map((step, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#266055] text-sm font-bold text-white">
                                                {idx + 1}
                                            </div>
                                            <span className="text-gray-700">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            {/* Prevention */}
                            <div>
                                <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                    <Info className="h-5 w-5 text-[#266055]" />
                                    Tips Pencegahan
                                </h4>
                                <ul className="space-y-2">
                                    {detectionExamples[selectedExample].prevention.map((tip, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-gray-600">
                                            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#266055]" />
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Action Button */}
                            <div className="flex gap-3 border-t pt-4">
                                <Link
                                href={dashboard()}
                                className="flex-1 rounded-lg bg-[#266055] px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-[#1e4a41]"
                                >
                                Coba Deteksi Sekarang
                                </Link>
                            </div>
                        </div>
                    </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Testimonial Section */}
            {
            (() => {
                type Testimonial = {
                quote: string;
                name: string;
                designation: string;
                src: string;
                rating: number;
                };

                const testimonials: Testimonial[] = [
                {
                    quote:
                    "Aplikasinya benar-benar membantu! Deteksi hama jadi jauh lebih cepat dan hasil panen meningkat karena penanganan bisa dilakukan lebih dini.",
                    name: "Rina Putri",
                    designation: "Petani Tomat — Malang",
                    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3",
                    rating: 5,
                },
                {
                    quote:
                    "Fitur komunitasnya luar biasa, saya bisa berbagi pengalaman dengan petani lain. Sekarang lebih mudah mengenali dan mengatasi serangan hama.",
                    name: "Budi Santoso",
                    designation: "Pekebun Cabai — Garut",
                    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
                    rating: 5,
                },
                {
                    quote:
                    "Sebagai penghobi urban farming, fitur prediksi cuaca dan deteksi otomatis benar-benar memudahkan saya merawat tanaman di rumah.",
                    name: "Lestari Dewi",
                    designation: "Pecinta Tanaman — Jakarta",
                    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3",
                    rating: 4,
                },
                {
                    quote:
                    "HAMASENSE memberi solusi lengkap, mulai dari deteksi hingga rekomendasi perawatan. Kini komunitas kami lebih cepat menangani serangan hama.",
                    name: "Rahman Hidayat",
                    designation: "Anggota Komunitas Tani — Yogyakarta",
                    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3",
                    rating: 5,
                },
                {
                    quote:
                    "Sistemnya cerdas dan mudah digunakan. Hasil deteksinya akurat dan membuat proses perawatan tanaman jadi lebih efisien.",
                    name: "Siti Marlina",
                    designation: "Petani Sayur Hidroponik — Bandung",
                    src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3",
                    rating: 4,
                },
                ];
                return (
                    <section className="relative bg-[#FDFDFC] md:py-16">
                        <div className="mx-auto max-w-6xl px-6 lg:px-8 text-center">
                            <p className="mb-3 text-md font-bold uppercase tracking-wider text-[#266055]">
                                Testimoni Pengguna
                            </p>
                            <h2 className="text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
                                Apa Kata Mereka Tentang <span className="font-logo">HAMASENSE</span>
                            </h2>
                            <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                                Cerita nyata dari petani dan pecinta tanaman yang telah merasakan manfaat teknologi aplikasi kami
                            </p>
                        </div>
                        <div className='z-0 bg-[#FDFDFC]'>
                            <AnimatedTestimonials testimonials={testimonials} autoplay />
                        </div>
                    </section>
                );
            })()
            }

            {/* Faq Section */}
            <section className="relative bg-white md:py-16">
                <div className="mx-auto max-w-6xl px-6 lg:px-8">
                    <div className="mb-10 text-center">
                        <p className="mb-3 text-md font-bold uppercase tracking-wider text-[#266055]">
                            Pertanyaan Umum
                        </p>
                        <h2 className="text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
                            Lihat Apa yang Sering Ditanyakan
                        </h2>
                        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
                            Temukan jawaban cepat seputar deteksi hama berbasis AI, akurasi, privasi, dan penggunaan aplikasi.
                        </p>
                    </div>

                    <Accordion
                    type="single"
                    collapsible
                    className="mx-auto max-w-3xl divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white"
                    >
                    {faqs.map((item, idx) => (
                        <AccordionItem key={idx} value={`faq-${idx}`} className="px-4">
                            <AccordionTrigger className="py-5 text-left text-base font-semibold text-[#1b1b18] hover:no-underline">
                                {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="pb-5 text-gray-600">
                                {item.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                    </Accordion>
                </div>
            </section>
            <Footer/>
        </>
    );
}
