// File: resources/js/components/home/WhyUs.tsx
'use client'
import { Check } from 'lucide-react'

export function WhyUs({
    features,
    title = 'Fitur Cerdas Untuk Anda Sebagai Asisten Merawat Tanaman',
    eyebrow = 'MENGAPA HAMASENSE',
    imageUrl = '/images/why-choose-us.png',
}: {
    features: string[]
    title?: string
    eyebrow?: string
    imageUrl?: string
}) {
    return (
        <section className="relative bg-[#FDFDFC]">
            <div className="pointer-events-none absolute -top-8 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-[#FDFDFC]" />
            <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-24">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
                    {/* Left: Image */}
                    <div className="relative">
                        <div className="relative overflow-hidden rounded-3xl">
                        <div className="aspect-[4/3] w-full">
                            <img
                            src={imageUrl}
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
                            {eyebrow}
                        </p>
                        <h2 className="text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
                            {title}
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
    )
}
