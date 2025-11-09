
export function Hero(props: { title: string; subtitle: string; }) {
    return (
        <section className="flex items-center justify-center px-6 py-20 lg:px-8">
            <div className="max-w-5xl text-center">
                <h1 className="mb-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
                    dangerouslySetInnerHTML={{ __html: props.title }} />
                <p className="mx-auto mb-10 max-w-2xl text-md leading-relaxed text-white/90 sm:text-xl">
                    {props.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">✓ Deteksi Real-time</div>
                    <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">✓ Akurasi Tinggi</div>
                    <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">✓ Mudah Digunakan</div>
                </div>
            </div>
        </section>
    );
}
