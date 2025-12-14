import { route } from 'ziggy-js';

export function CtaSection() {
    return (
        <section className="relative bg-gradient-to-r from-primary via-primary/95 to-emerald-700 pt-20 pb-20 md:pt-24 md:pb-24">
            {/* TOP SHAPE */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
                <svg
                    className="relative block h-[56px] w-[calc(100%+1.3px)]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        className="fill-white"
                    />
                </svg>
            </div>

            {/* CONTENT */}
            <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
                    Ingin Tahu Lebih Lanjut?
                </h2>
                <p className="mt-4 text-base text-white/90 md:text-lg">
                    Hamasense terus berkembang untuk mendukung ekosistem kebun kota.
                    Terbuka untuk kolaborasi dengan komunitas, UMKM pangan segar, dan
                    pengelola ruang hijau urban.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <a
                        href="/contact"
                        className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary transition-colors hover:bg-gray-100"
                    >
                        Hubungi Kami
                    </a>
                    <a
                        href={route('detect.index')}
                        className="rounded-full border border-white/80 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-primary"
                    >
                        Coba Sekarang
                    </a>
                </div>
            </div>

            {/* BOTTOM SHAPE */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
                <svg
                    className="relative block h-[56px] w-[calc(100%+1.3px)]"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        className="fill-white"
                    />
                </svg>
            </div>
        </section>
    );
}
