'use client'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { AlertTriangle, Check, CheckCircle2, Info } from 'lucide-react'
import { Link } from '@inertiajs/react'
import type { DetectionExample } from '@/types/home'

function getSeverityColor(severity: DetectionExample['severity']): string {
  switch (severity) {
    case 'Tinggi':
      return 'border-red-300 text-red-700'
    case 'Sedang':
      return 'border-yellow-300 text-yellow-700'
    case 'Rendah':
    default:
      return 'border-green-300 text-green-700'
  }
}

export function DetectionExamples({
    examples,
    title = 'Lihat Hasil Deteksi AI Kami',
    subtitle = 'Lihat contoh deteksi penyakit tanaman yang berhasil diidentifikasi oleh sistem AI kami dengan akurasi tinggi',
    ctaHref = '/dashboard',
    ctaLabel = 'Mulai deteksi sekarang →',
}: {
    examples: DetectionExample[]
    title?: string
    subtitle?: string
    ctaHref?: string
    ctaLabel?: string
}) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    return (
        <section className="relative bg-gradient-to-b from-white to-[#FDFDFC] py-16 lg:py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">{title}</h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">{subtitle}</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {examples.map((example, index) => (
                        <div
                            key={example.id}
                            onClick={() => setSelectedIndex(index)}
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
                                    <Badge className="bg-white/90 text-[#266055] hover:bg-white">Klik untuk detail</Badge>
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
                                        <div className="h-1.5 rounded-full bg-[#266055] transition-all duration-500" style={{ width: `${example.confidence}%` }} />
                                    </div>
                                    <span className="text-sm font-semibold text-[#266055]">{example.confidence}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-600">
                        Ingin mencoba sendiri?{' '}
                        <Link href={ctaHref} className="font-semibold text-[#266055] hover:underline">{ctaLabel}</Link>
                    </p>
                </div>
            </div>

            {/* Detail Dialog */}
            <Dialog open={selectedIndex !== null} onOpenChange={() => setSelectedIndex(null)}>
                <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto z-[2000]">
                {selectedIndex !== null && (
                    <>
                    <DialogHeader>
                        <div className="mb-4 flex items-start justify-start gap-4">
                            <div>
                                <DialogTitle className="text-xl md:text-2xl font-bold text-[#1b1b18] text-left">
                                    {examples[selectedIndex].disease}
                                </DialogTitle>
                                <DialogDescription className="mt-2 text-base text-left">
                                    Tanaman: {examples[selectedIndex].plantName}
                                </DialogDescription>
                            </div>
                            <Badge variant="outline" className={`${getSeverityColor(examples[selectedIndex].severity)} text-sm`}>
                                {examples[selectedIndex].severity}
                            </Badge>
                        </div>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Image */}
                        <div className="relative aspect-video overflow-hidden rounded-xl shadow-md">
                            <img
                                src={examples[selectedIndex].image}
                                alt={`${examples[selectedIndex].plantName} - ${examples[selectedIndex].disease}`}
                                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                            <div className="absolute bottom-3 left-3 text-white drop-shadow-md">
                                <p className="font-semibold">{examples[selectedIndex].plantName}</p>
                                <p className="text-sm opacity-90">{examples[selectedIndex].disease}</p>
                            </div>
                        </div>

                        {/* Confidence */}
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-semibold text-gray-700">Tingkat Keyakinan AI</span>
                                <span className="text-2xl font-bold text-[#266055]">{examples[selectedIndex].confidence}%</span>
                            </div>
                            <div className="overflow-hidden rounded-full bg-gray-200">
                                <div className="h-3 rounded-full bg-gradient-to-r from-[#266055] to-[#1e4a41]" style={{ width: `${examples[selectedIndex].confidence}%` }} />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="mb-2 font-semibold text-gray-900">Deskripsi</h4>
                            <p className="text-gray-600">{examples[selectedIndex].description}</p>
                        </div>

                        {/* Symptoms */}
                        <div>
                            <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                                <AlertTriangle className="h-5 w-5 text-orange-500" />
                                Gejala yang Terlihat
                            </h4>
                            <ul className="space-y-2">
                                {examples[selectedIndex].symptoms.map((symptom, idx) => (
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
                                {examples[selectedIndex].treatment.map((step, idx) => (
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
                                {examples[selectedIndex].prevention.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-600">
                                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#266055]" />
                                    <span>{tip}</span>
                                </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action */}
                        <div className="flex gap-3 border-t pt-4">
                            <Link href={ctaHref} className="flex-1 rounded-lg bg-[#266055] px-6 py-3 text-center font-semibold text-white transition-colors hover:bg-[#1e4a41]">
                                Coba Deteksi Sekarang
                            </Link>
                        </div>
                    </div>
                    </>
                )}
                </DialogContent>
            </Dialog>
        </section>
    )
}