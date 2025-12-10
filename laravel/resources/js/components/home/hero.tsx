'use client';

type HeroProps = {
    title: string;
    subtitle?: string;
    showPills?: boolean;
    className?: string;
};

export function Hero({ title, subtitle, showPills = true, className }: HeroProps) {
    return (
        <section className={`flex items-center justify-center px-6 py-20 lg:px-8 ${className ?? ''}`}>
            <div className="max-w-5xl text-center">
                <h1
                    className="mb-4 text-5xl font-semibold tracking-tight text-white lg:text-7xl pt-10 md:pt-0"
                    dangerouslySetInnerHTML={{ __html: title }}
                />
                {subtitle && (
                <p className="mx-auto mb-4 max-w-2xl text-md leading-relaxed text-white/90 sm:text-xl">
                    {subtitle}
                </p>
                )}

                {showPills && (
                <div className="flex flex-wrap items-center justify-center gap-3">
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
                )}
            </div>
        </section>
    );
}
