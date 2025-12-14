import HomeLayout from '@/layouts/home-layout';
import type { AboutPageProps } from '@/types/home';
import { Hero } from '@/components/home/hero';
import { Users, Target, BookOpen, Sparkles, Droplets } from 'lucide-react';

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
        { year: '2025 Q1', event: 'Inisiasi Kebutuhan pengguna untuk Urban Farming' },
        { year: '2025 Q2', event: 'Pengembangan Model AI Deteksi Hama Tanaman Urban' },
        { year: '2025 Q3', event: 'Testing & Validasi Sistem pada Kebun Kota & Hidroponik' },
        { year: '2025 Q4', event: 'Launch beta untuk masyarakat kota demi wujudkan kemandirian pangan' },
    ];

    const values = [
        {
            icon: Target,
            title: 'Inovasi Hijau',
            description: 'Menggabungkan Aplikasi dan AI model yang terlatih serta teknik urban farming hemat ruang',
        },
        {
            icon: Droplets,
            title: 'Efisiensi Air',
            description: 'Rekomendasi nutrisi dan penyiraman presisi untuk kebun kota',
        },
        {
            icon: BookOpen,
            title: 'Edukasi Praktis',
            description: 'Panduan singkat untuk balkon, pot, hingga instalasi hidroponik',
        },
        {
            icon: Users,
            title: 'Komunitas',
            description: 'Berjejaring dengan pegiat kebun kota, kampus, dan UMKM pangan segar',
        },
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
            {/* About Project Section */}
            <section className="bg-gradient-to-br from-primary/5 via-white to-primary/10 py-14 md:py-20">
                <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 md:grid md:grid-cols-2 md:items-center">
                    <div>
                        <h2 className="mb-4 text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
                            Tentang <span className="font-logo">HAMASENSE</span>
                        </h2>
                        <p className="text-base leading-relaxed text-gray-600 md:text-md">
                            Hamasense adalah project berbasis kecerdasan buatan untuk mendukung
                            urban farming. Kami memanfaatkan{' '}
                            <span className="font-medium text-gray-800">Object Detection</span>{' '}
                            dan{' '}
                            <span className="font-medium text-gray-800">Machine Learning</span>{' '}
                            guna mendeteksi kemungkinan penyakit dan hama serta memandu perawatan kebun pot, hidroponik,
                            hingga kebun dilahan terbatas.
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                            Dengan smartphone, pengguna dapat memindai daun yang bermasalah,
                            mendapat identifikasi hama, langkah organik yang bisa segera
                            dilakukan, serta rekomendasi nutrisi agar tanaman tetap tumbuh di
                            ruang minim sinar matahari.
                        </p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl bg-white/80 p-4 text-sm shadow-sm ring-1 ring-primary/10">
                                <p className="font-semibold text-gray-800">
                                    Fokus pada Pengalaman Pengguna
                                </p>
                                <p className="mt-1 text-gray-600">
                                    Antarmuka sederhana untuk pemula; mendukung mode cepat
                                    ketika pengguna sedang merawat kebun sebelum beraktivitas.
                                </p>
                            </div>
                            <div className="rounded-xl bg-white/80 p-4 text-sm shadow-sm ring-1 ring-primary/10">
                                <p className="font-semibold text-gray-800">
                                    Berbasis Riset & Data
                                </p>
                                <p className="mt-1 text-gray-600">
                                    Dataset mencakup hama daun tomat, cabai pot, selada hidroponik,
                                    dan tanaman lain yang populer di area urban.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="relative w-full max-w-sm">
                            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-emerald-500 opacity-80 blur-lg" />
                            <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-emerald-600 p-8 text-white shadow-2xl">
                                <div className="flex flex-col items-center text-center">
                                    <Sparkles className="mb-4 h-14 w-14 md:h-20 md:w-20" />
                                    <p className="text-sm uppercase tracking-wide text-white/80">
                                        Akurasi Model
                                    </p>
                                    <p className="mt-1 text-4xl font-bold md:text-5xl">
                                        95%+
                                    </p>
                                    <p className="mt-2 text-sm text-white/80">
                                        Berdasarkan pengujian awal terhadap dataset uji
                                        internal.
                                    </p>
                                    <div className="mt-6 grid w-full gap-4 text-left text-xs text-white/90 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                                            <p className="font-semibold">Real-time</p>
                                            <p className="mt-1 text-[11px]">
                                                Deteksi dapat dilakukan dalam hitungan detik
                                                setelah gambar diunggah.
                                            </p>
                                        </div>
                                        <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                                            <p className="font-semibold">Multi-Hama</p>
                                            <p className="mt-1 text-[11px]">
                                                Dukungan hama umum di kebun pot, hidroponik, hingga
                                                kebun komunal.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Misi & Nilai Section */}
            <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
                <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
                    <div className="w-full lg:w-5/12">
                        <h2 className="mb-4 text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
                            Misi Kami: Kebun Kota Cerdas
                        </h2>
                        <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
                            Hamasense membantu warga kota membangun kebun produktif di ruang
                            sempit. Kami menyatukan teknologi deteksi hama berbasis AI dengan
                            praktik urban farming agar panen sayur dan buah tetap higienis,
                            hemat air, dan mudah dirawat.
                        </p>
                        <p className="mt-3 text-sm text-gray-500 md:text-base">
                            Fokus kami untuk mempermudah pemula memulai kebun seperti di lahan kosong
                            atau balkon, mendukung komunitas hijau, dan menumbuhkan kemandirian
                            pangan lokal.
                        </p>

                        {/* Quick stats */}
                        <div className="mt-6 grid gap-4 text-center sm:grid-cols-3">
                            <div className="rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-primary/10">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Kebun Aktif
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-primary">
                                    95%+
                                </p>
                            </div>
                            <div className="rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-primary/10">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Efisiensi Air
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-primary">
                                    -30%
                                </p>
                            </div>
                            <div className="rounded-xl bg-white/80 p-4 shadow-sm ring-1 ring-primary/10">
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Fokus Utama
                                </p>
                                <p className="mt-1 text-sm font-semibold text-gray-800">
                                    Balkon, Rooftop, Komunal
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-7/12">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                            {values.map((value, index) => {
                                const Icon = value.icon;
                                return (
                                    <div
                                        key={index}
                                        className="group h-full rounded-2xl bg-white/80 p-6 shadow-sm ring-1 ring-primary/10 transition-all hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {value.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {value.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="mx-auto max-w-7xl px-6 py-14 md:py-16 lg:py-20">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="mb-4 text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
                        Perjalanan Kami
                    </h2>
                    <p className="mt-3 text-sm text-gray-600 md:text-base">
                        Dari ide awal hingga versi beta, Hamasense dikembangkan secara
                        bertahap melalui proses riset, implementasi, dan validasi.
                    </p>
                </div>

                <div className="mt-10 md:mt-14">
                    <div className="relative mx-auto max-w-3xl">
                        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 md:left-1/2" />
                        <div className="space-y-8 md:space-y-10">
                            {milestones.map((milestone, index) => (
                                <div
                                    key={index}
                                    className={`relative flex flex-col gap-4 md:flex-row ${
                                        index % 2 === 0
                                            ? 'md:items-center'
                                            : 'md:flex-row-reverse md:items-center'
                                    }`}
                                >
                                    <div className="md:w-1/2">
                                        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-primary/10 md:p-5">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                                {milestone.year}
                                            </p>
                                            <p className="mt-2 text-sm font-medium text-gray-900 md:text-base">
                                                {milestone.event}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden absolute left-4 top-4 md:flex h-7 w-7 items-center justify-center rounded-full bg-white ring-4 ring-primary/20 md:left-1/2 md:-translate-x-1/2">
                                        <span className="h-3 w-3 rounded-full bg-primary" />
                                    </div>
                                    <div className="hidden md:block md:w-1/2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {/* Team Section */}
            <section className="bg-gradient-to-br from-gray-50 via-white to-primary/5 py-14 md:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
                            Tim Di Balik <span className="font-logo">HAMASENSE</span>
                        </h2>
                        <p className="mt-3 text-sm text-gray-600 md:text-base">
                            Tim multidisiplin yang menyeimbangkan teknologi AI dengan praktik
                            urban farming untuk masyarakat kota.
                        </p>
                    </div>

                    {/* Mobile: 1 card per row scroll kebawah */}
                    <div className="mt-10 flex flex-col gap-6 lg:hidden">
                        {teamMembers.map((member, index) => (
                            <TeamCard key={member.nim} member={member} highlight={index === 0} />
                        ))}
                    </div>

                    <div className="mt-12 hidden lg:block">
                        {/* Project Lead - centered */}
                        <div className="mb-8 flex justify-center">
                            <div className="w-full max-w-sm">
                                <TeamCard member={lead} highlight />
                            </div>
                        </div>

                        {/* Other team members - 2x2 grid */}
                        <div className="mx-auto grid max-w-6xl grid-cols-4 gap-6">
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
            className={`relative overflow-hidden rounded-3xl bg-gray-900 text-white shadow-md transition-transform duration-300 ease-out focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-white hover:-translate-y-1 hover:shadow-xl ${
                highlight ? 'h-100' : 'h-72'
            }`}
        >
            {/* Background image */}
            <img
                src={member.image}
                alt={member.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/10" />

            {/* Content */}
            <div className="relative flex h-full flex-col justify-between p-4 sm:p-5">
                {/* Badge untuk project lead */}
                {highlight && (
                    <div className="self-start rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90 backdrop-blur">
                        Project Lead
                    </div>
                )}

                <div className="mt-auto">
                    <p className="text-xs text-white/70">NIM: {member.nim}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">
                        {member.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/80">{member.role}</p>
                </div>
            </div>
        </article>
    );
}
