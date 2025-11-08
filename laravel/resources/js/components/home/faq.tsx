'use client'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import type { Faq as FaqType } from '@/types/home'

export function Faq({ items, title = 'Lihat Apa yang Sering Ditanyakan', eyebrow = 'Pertanyaan Umum', subtitle = 'Temukan jawaban cepat seputar deteksi hama berbasis AI, akurasi, privasi, dan penggunaan aplikasi.' }: {
    items: FaqType[]
    title?: string
    eyebrow?: string
    subtitle?: string
}) {
    return (
        <section className="relative bg-white md:py-16">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <p className="mb-3 text-md font-bold uppercase tracking-wider text-[#266055]">{eyebrow}</p>
                    <h2 className="text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">{title}</h2>
                    <p className="mx-auto mt-3 max-w-2xl text-gray-600">{subtitle}</p>
                </div>

                <Accordion type="single" collapsible className="mx-auto max-w-3xl divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
                    {items.map((item, idx) => (
                        <AccordionItem key={idx} value={`faq-${idx}`} className="px-4">
                            <AccordionTrigger className="py-5 text-left text-base font-semibold text-[#1b1b18] hover:no-underline">
                                {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="pb-5 text-gray-600">{item.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}