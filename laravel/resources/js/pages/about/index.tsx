import HomeLayout from '@/layouts/home-layout';
import type { AboutPageProps } from '@/types/home';
import { Hero } from '@/components/home/hero';
import { Users, Target, BookOpen, Sparkles, Droplets, Leaf, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

type TeamMember = {
    name: string;
    role: string;
    nim: string;
    image: string;
};

export default function About(props: AboutPageProps) {
    const teamMembers: TeamMember[] = [
        {
            name: 'Muchamad Fajri Amirul Nasrullah, S.ST., M.Sc',
            role: 'Project Manager',
            nim: '201910001',
            image: 'https://if.polibatam.ac.id/assets/backupold/img/dosen/fajri.JPG',
        },
        {
            name: 'Muhammad Danial',
            role: 'Frontend Developer',
            nim: '201910002',
            image: 'https://if.polibatam.ac.id/assets/backupold/img/dosen/fajri.JPG',
        },
        {
            name: 'Bastian Henriko Limbong',
            role: 'Backend Developer',
            nim: '201910003',
            image: 'https://if.polibatam.ac.id/assets/backupold/img/dosen/fajri.JPG',
        },
        {
            name: 'Wahyudi',
            role: 'UI/UX Designer',
            nim: '201910004',
            image: 'https://if.polibatam.ac.id/assets/backupold/img/dosen/fajri.JPG',
        },
        {
            name: 'Steven Marcell Samosir',
            role: 'Data Scientist & Agronomist',
            nim: '201910005',
            image: 'https://if.polibatam.ac.id/assets/backupold/img/dosen/fajri.JPG',
        },
    ];

    const milestones = [
        { year: '2025 Q1', event: 'Inisiasi Kebutuhan pengguna untuk Urban Farming', icon: Leaf, status: 'completed' },
        { year: '2025 Q2', event: 'Pengembangan Model AI Deteksi Hama Tanaman Urban', icon: Zap, status: 'completed' },
        { year: '2025 Q3', event: 'Testing & Validasi Sistem pada Kebun Kota & Hidroponik', icon: CheckCircle2, status: 'current' },
        { year: '2025 Q4', event: 'Launch beta untuk masyarakat kota demi wujudkan kemandirian pangan', icon: ArrowRight, status: 'upcoming' },
    ];

    const values = [
        {
            icon: Target,
            title: 'Inovasi Hijau',
            description: 'Menggabungkan Aplikasi dan AI model yang terlatih serta teknik urban farming hemat ruang',
            color: 'from-emerald-500 to-green-600',
        },
        {
            icon: Droplets,
            title: 'Efisiensi Air',
            description: 'Rekomendasi nutrisi dan penyiraman presisi untuk kebun kota',
            color: 'from-cyan-500 to-blue-600',
        },
        {
            icon: BookOpen,
            title: 'Edukasi Praktis',
            description: 'Panduan singkat untuk balkon, pot, hingga instalasi hidroponik',
            color: 'from-amber-500 to-orange-600',
        },
        {
            icon: Users,
            title: 'Komunitas',
            description: 'Berjejaring dengan pegiat kebun kota, kampus, dan UMKM pangan segar',
            color: 'from-violet-500 to-purple-600',
        },
    ];

    const stats = [
        { value: '95%+', label: 'Akurasi Deteksi', sublabel: 'Model AI Terlatih' },
        { value: '500+', label: 'Dataset Gambar', sublabel: 'Hama & Penyakit' },
        { value: '<3s', label: 'Waktu Deteksi', sublabel: 'Real-time Analysis' },
        { value: '10+', label: 'Jenis Tanaman', sublabel: 'Didukung Sistem' },
    ];

    const lead = teamMembers[0];
    const others = teamMembers.slice(1);

    return (
        <HomeLayout
            title="Tentang Kami"
            navItems={props.navItems}
            hero={{
                size: 'half',
                bg: {
                    imageUrl: '/images/bg-hero.png',
                    overlay: 'bg-gradient-to-b from-black/60 via-black/40 to-black/80',
                },
                content: (
                    <Hero className="md:mt-10" title="Tentang Kami" showPills={false} />
                ),
            }}
        >
            {/* Stats Banner */}
            <section className="relative -mt-16 z-10 px-4 md:px-6">
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-lg shadow-primary/5 ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 md:p-6"
                            >
                                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br from-primary/10 to-emerald-500/10 blur-2xl transition-all duration-500 group-hover:scale-150" />
                                <p className="relative text-2xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent md:text-3xl">
                                    {stat.value}
                                </p>
                                <p className="relative mt-1 text-sm font-semibold text-gray-800">
                                    {stat.label}
                                </p>
                                <p className="relative text-xs text-gray-500">
                                    {stat.sublabel}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Project Section */}
            <section className="relative overflow-hidden py-16 md:py-24">
                <div className="relative mx-auto max-w-7xl px-4 md:px-6">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
                        {/* Left Content */}
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
                                <Leaf className="h-4 w-4" />
                                Solusi Smart Farming
                            </div>

                            <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                                Tentang{' '}
                                <span className="relative">
                                    <span className="font-logo bg-gradient-to-r from-primary via-emerald-600 to-primary bg-clip-text text-transparent">
                                        HAMASENSE
                                    </span>
                                    <span className="absolute -bottom-1 left-0 h-1 w-full bg-gradient-to-r from-primary to-emerald-500 rounded-full" />
                                </span>
                            </h2>

                            <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
                                Hamasense adalah platform berbasis kecerdasan buatan untuk mendukung
                                urban farming. Kami memanfaatkan{' '}
                                <span className="font-semibold text-gray-800">Object Detection</span>{' '}
                                dan{' '}
                                <span className="font-semibold text-gray-800">Machine Learning</span>{' '}
                                guna mendeteksi kemungkinan penyakit dan hama serta memandu perawatan kebun.
                            </p>

                            <p className="mt-4 text-sm leading-relaxed text-gray-500 md:text-base">
                                Dengan smartphone, pengguna dapat memindai daun yang bermasalah,
                                mendapat identifikasi hama, langkah organik yang bisa segera
                                dilakukan, serta rekomendasi nutrisi agar tanaman tetap tumbuh.
                            </p>

                            {/* Feature Cards */}
                            <div className="mt-8 grid gap-4 sm:grid-cols-2">
                                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-lg hover:ring-primary/20">
                                    <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-primary/10 blur-xl transition-all duration-300 group-hover:scale-150" />
                                    <div className="relative">
                                        <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2.5">
                                            <Zap className="h-5 w-5 text-primary" />
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            User Experience First
                                        </p>
                                        <p className="mt-1.5 text-sm text-gray-600">
                                            Antarmuka sederhana untuk pemula, mendukung mode cepat saat merawat kebun.
                                        </p>
                                    </div>
                                </div>

                                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-lg hover:ring-primary/20">
                                    <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-emerald-500/10 blur-xl transition-all duration-300 group-hover:scale-150" />
                                    <div className="relative">
                                        <div className="mb-3 inline-flex rounded-xl bg-emerald-500/10 p-2.5">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            Berbasis Riset & Data
                                        </p>
                                        <p className="mt-1.5 text-sm text-gray-600">
                                            Dataset mencakup hama daun tomat, cabai pot, dan selada hidroponik.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div className="order-1 flex items-center justify-center lg:order-2">
                            <div className="relative w-full max-w-md">
                                {/* Glow effect */}
                                <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary via-emerald-500 to-cyan-500 opacity-30 blur-2xl" />

                                {/* Main card */}
                                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary/95 to-emerald-600 p-8 text-white shadow-2xl md:p-10">
                                    {/* Decorative circles */}
                                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                                    <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

                                    <div className="relative flex flex-col items-center text-center">
                                        <div className="mb-6 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                                            <Sparkles className="h-12 w-12 md:h-16 md:w-16" />
                                        </div>

                                        <p className="text-sm font-medium uppercase tracking-widest text-white/70">
                                            Akurasi Model
                                        </p>
                                        <p className="mt-2 text-5xl font-bold md:text-6xl">
                                            95%<span className="text-3xl">+</span>
                                        </p>
                                        <p className="mt-3 text-sm text-white/70 max-w-xs">
                                            Berdasarkan pengujian terhadap dataset uji internal dengan ribuan sampel.
                                        </p>

                                        {/* Mini stats */}
                                        <div className="mt-8 grid w-full grid-cols-2 gap-3">
                                            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
                                                <p className="text-2xl font-bold">{'<'} 3s</p>
                                                <p className="mt-1 text-xs text-white/70">Real-time Detection</p>
                                            </div>
                                            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/15">
                                                <p className="text-2xl font-bold">10+</p>
                                                <p className="mt-1 text-xs text-white/70">Jenis Hama</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Misi & Nilai Section */}
            <section className="relative bg-gradient-to-b from-gray-50/50 to-white py-16 md:py-24">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    {/* Section Header */}
                    <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-600 mb-4">
                            <Target className="h-4 w-4" />
                            Misi & Nilai
                        </div>
                        <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                            Kebun Kota{' '}
                            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                                Cerdas
                            </span>
                        </h2>
                        <p className="mt-4 text-base text-gray-600 md:text-lg max-w-2xl mx-auto">
                            Hamasense membantu warga kota membangun kebun produktif di ruang
                            sempit dengan teknologi deteksi hama berbasis AI.
                        </p>
                    </div>

                    {/* Values Grid */}
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:ring-primary/20"
                                >
                                    {/* Hover gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 transition-opacity duration-500 group-hover:opacity-5`} />

                                    {/* Icon with gradient bg */}
                                    <div className={`mb-5 inline-flex rounded-xl bg-gradient-to-br ${value.color} p-3.5 text-white shadow-lg shadow-primary/20`}>
                                        <Icon className="h-6 w-6" />
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                                        {value.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                                        {value.description}
                                    </p>

                                    {/* Bottom accent line */}
                                    <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${value.color} transition-all duration-500 group-hover:w-full`} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-16 rounded-3xl bg-gradient-to-br from-primary/5 via-white to-emerald-500/5 p-8 ring-1 ring-primary/10 md:p-10">
                        <div className="grid gap-6 md:grid-cols-3 md:gap-8 text-center">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
                                </div>
                                <p className="relative text-4xl font-bold text-primary md:text-5xl">95%+</p>
                                <p className="relative mt-2 text-sm font-medium text-gray-600">Kebun Aktif Terbantu</p>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-20 w-20 rounded-full bg-cyan-500/10 blur-2xl" />
                                </div>
                                <p className="relative text-4xl font-bold text-cyan-600 md:text-5xl">-30%</p>
                                <p className="relative mt-2 text-sm font-medium text-gray-600">Konsumsi Air Lebih Efisien</p>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl" />
                                </div>
                                <p className="relative text-4xl font-bold text-emerald-600 md:text-5xl">3 Area</p>
                                <p className="relative mt-2 text-sm font-medium text-gray-600">Balkon, Rooftop, Komunal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="relative py-16 md:py-24 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0">
                    <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 md:px-6">
                    {/* Section Header */}
                    <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
                        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
                            <ArrowRight className="h-4 w-4" />
                            Roadmap
                        </div>
                        <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                            Perjalanan{' '}
                            <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                                Kami
                            </span>
                        </h2>
                        <p className="mt-4 text-base text-gray-600 md:text-lg">
                            Dari ide awal hingga versi beta, Hamasense dikembangkan melalui proses riset dan validasi.
                        </p>
                    </div>

                    {/* Timeline Cards */}
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-emerald-500 to-gray-200 md:left-1/2 md:-translate-x-px" />

                        <div className="space-y-8 md:space-y-12">
                            {milestones.map((milestone, index) => {
                                const Icon = milestone.icon;
                                const isCompleted = milestone.status === 'completed';
                                const isCurrent = milestone.status === 'current';

                                return (
                                    <div
                                        key={index}
                                        className={`relative flex flex-col gap-4 pl-12 md:flex-row md:pl-0 ${index % 2 === 0
                                            ? 'md:pr-[calc(50%+2rem)]'
                                            : 'md:pl-[calc(50%+2rem)]'
                                            }`}
                                    >
                                        {/* Timeline Node */}
                                        <div className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white md:left-1/2 md:-translate-x-1/2 ${isCompleted
                                            ? 'bg-gradient-to-br from-primary to-emerald-500 text-white'
                                            : isCurrent
                                                ? 'bg-white ring-primary/30 animate-pulse'
                                                : 'bg-gray-100'
                                            }`}>
                                            {isCompleted ? (
                                                <CheckCircle2 className="h-4 w-4" />
                                            ) : isCurrent ? (
                                                <span className="h-3 w-3 rounded-full bg-primary" />
                                            ) : (
                                                <span className="h-2 w-2 rounded-full bg-gray-300" />
                                            )}
                                        </div>

                                        {/* Card */}
                                        <div className={`group relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-6 ${isCompleted ? 'ring-primary/20' : isCurrent ? 'ring-primary/40 shadow-lg shadow-primary/10' : 'ring-gray-100'
                                            }`}>
                                            {/* Status Badge */}
                                            <div className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${isCompleted
                                                ? 'bg-primary/10 text-primary'
                                                : isCurrent
                                                    ? 'bg-amber-500/10 text-amber-600'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                {isCompleted ? 'Selesai' : isCurrent ? 'Berjalan' : 'Mendatang'}
                                            </div>

                                            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${isCompleted ? 'bg-primary/10' : isCurrent ? 'bg-amber-500/10' : 'bg-gray-100'
                                                }`}>
                                                <Icon className={`h-5 w-5 ${isCompleted ? 'text-primary' : isCurrent ? 'text-amber-600' : 'text-gray-400'
                                                    }`} />
                                            </div>

                                            <p className={`text-xs font-bold uppercase tracking-widest ${isCompleted ? 'text-primary' : isCurrent ? 'text-amber-600' : 'text-gray-400'
                                                }`}>
                                                {milestone.year}
                                            </p>
                                            <p className="mt-2 text-base font-medium text-gray-900 md:text-lg pr-16">
                                                {milestone.event}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0">
                    <div className="absolute -left-48 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
                    <div className="absolute -right-48 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 md:px-6">
                    {/* Section Header */}
                    <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
                        <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-600 mb-4">
                            <Users className="h-4 w-4" />
                            Tim Kami
                        </div>
                        <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                            Tim Di Balik{' '}
                            <span className="font-logo bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                                HAMASENSE
                            </span>
                        </h2>
                        <p className="mt-4 text-base text-gray-600 md:text-lg max-w-2xl mx-auto">
                            Tim multidisiplin yang menyeimbangkan teknologi AI dengan praktik
                            urban farming untuk masyarakat kota.
                        </p>
                    </div>

                    {/* Mobile: Stack cards */}
                    <div className="flex flex-col gap-4 lg:hidden">
                        {teamMembers.map((member, index) => (
                            <TeamCard key={member.nim} member={member} highlight={index === 0} />
                        ))}
                    </div>

                    {/* Desktop: Lead centered + grid */}
                    <div className="hidden lg:block">
                        {/* Project Lead - centered and featured */}
                        <div className="mb-10 flex justify-center">
                            <div className="w-full max-w-md">
                                <TeamCard member={lead} highlight />
                            </div>
                        </div>

                        {/* Other team members - 4 columns */}
                        <div className="grid grid-cols-4 gap-5">
                            {others.map((member) => (
                                <TeamCard key={member.nim} member={member} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </HomeLayout>
    );
}

type TeamCardProps = {
    member: TeamMember;
    highlight?: boolean;
};

function TeamCard({ member, highlight }: TeamCardProps) {
    return (
        <article
            className={`group relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-lg transition-all duration-500 ease-out focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-white hover:-translate-y-2 hover:shadow-2xl ${highlight ? 'h-[26rem]' : 'h-72'
                }`}
        >
            {/* Background image */}
            <img
                src={member.image}
                alt={member.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

            {/* Decorative accent */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Content */}
            <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
                {/* Badge untuk project lead */}
                {highlight && (
                    <div className="self-start">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary/90 to-emerald-500/90 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-white shadow-lg backdrop-blur">
                            <Sparkles className="h-3.5 w-3.5" />
                            Project Lead
                        </div>
                    </div>
                )}

                <div className="mt-auto">
                    <p className="text-xs font-medium text-white/60 tracking-wider">
                        NIM: {member.nim}
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors duration-300">
                        {member.name}
                    </h3>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white/90 backdrop-blur-sm">
                        {member.role}
                    </div>
                </div>
            </div>
        </article>
    );
}
