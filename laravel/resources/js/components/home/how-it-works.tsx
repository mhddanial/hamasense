'use client'

import { motion, type Variants } from 'framer-motion'

const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    },
}

const stepContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
        },
    },
}

const stepVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    },
}

const iconVariants: Variants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
            duration: 0.5,
            ease: 'backOut' as const,
        },
    },
}

const numberVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: 'backOut' as const,
            delay: 0.2,
        },
    },
}

const lineVariants: Variants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: {
        scaleY: 1,
        opacity: 1,
        transition: {
            duration: 1.2,
            ease: 'easeInOut' as const,
        },
    },
}

export function HowItWorks() {
    return (
        <section className="relative bg-white py-16 lg:py-16">
            <div className="mx-auto max-w-6xl px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="mb-16 text-center"
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <p className="mb-3 text-md font-bold uppercase tracking-wider text-[#266055]">CARA KERJA</p>
                    <h2 className="mb-4 text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
                        Proses Cepat Dalam 3 Langkah Mudah
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600">Identifikasi tanaman anda dengan mudah menggunakan teknologi AI kami.</p>
                </motion.div>

                {/* Steps container */}
                <div className="relative text-center sm:text-left">
                    <motion.div
                        className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#266055] via-[#266055] to-[#266055]/30 md:block origin-top"
                        variants={lineVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    />
                    <motion.div
                        className="space-y-16 md:space-y-24"
                        variants={stepContainerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {/* Step 01 */}
                        <motion.div
                            className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2"
                            variants={stepVariants}
                        >
                            <motion.div
                                className="order-2 md:order-1 md:text-right"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="inline-block rounded-2xl bg-gradient-to-br from-[#266055]/5 to-[#266055]/10 p-8 backdrop-blur-sm">
                                    <motion.div
                                        className="mb-4 inline-block rounded-xl bg-white p-4 shadow-lg"
                                        variants={iconVariants}
                                        whileHover={{ rotate: 5, scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img src="/icons/take-a-photo.svg" alt="Ambil atau Upload Foto" className="h-16 w-16 object-contain" loading="lazy" />
                                    </motion.div>
                                </div>
                            </motion.div>
                            <motion.div
                                className="absolute left-1/2 top-1/2 z-5 hidden -translate-x-1/2 -translate-y-1/2 md:block"
                                variants={numberVariants}
                            >
                                <motion.div
                                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#266055] shadow-lg ring-4 ring-white"
                                    whileHover={{ scale: 1.15 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <span className="text-xl font-bold text-white">01</span>
                                </motion.div>
                            </motion.div>
                            <div className="order-1 md:order-2">
                                <div className="md:pl-8">
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#266055] md:hidden">
                                        <span className="text-lg font-bold text-white">01</span>
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold text-[#1b1b18]">Ambil atau Upload Foto</h3>
                                    <p className="text-md leading-relaxed text-gray-600">
                                        Ambil foto tanaman Anda yang terkena hama atau upload gambar dari galeri. Pastikan foto jelas dan fokus pada bagian yang bermasalah untuk hasil deteksi yang optimal.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Step 02 */}
                        <motion.div
                            className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2"
                            variants={stepVariants}
                        >
                            <div className="order-1 md:text-right">
                                <div className="md:pr-8">
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#266055] md:hidden">
                                        <span className="text-lg font-bold text-white">02</span>
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold text-[#1b1b18]">Analisis AI</h3>
                                    <p className="text-md leading-relaxed text-gray-600">
                                        Sistem AI kami menganalisis foto secara otomatis dalam hitungan detik untuk mengidentifikasi jenis hama dengan akurasi tinggi.
                                    </p>
                                </div>
                            </div>
                            <motion.div
                                className="absolute left-1/2 top-1/2 z-5 hidden -translate-x-1/2 -translate-y-1/2 md:block"
                                variants={numberVariants}
                            >
                                <motion.div
                                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#266055] shadow-lg ring-4 ring-white"
                                    whileHover={{ scale: 1.15 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <span className="text-xl font-bold text-white">02</span>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                className="order-2"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="inline-block rounded-2xl bg-gradient-to-br from-[#266055]/5 to-[#266055]/10 p-8 backdrop-blur-sm">
                                    <motion.div
                                        className="mb-4 inline-block rounded-xl bg-white p-4 shadow-lg"
                                        variants={iconVariants}
                                        whileHover={{ rotate: -5, scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img src="/icons/ai-analysis.svg" alt="Analisis AI" className="h-16 w-16 object-contain" loading="lazy" />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Step 03 */}
                        <motion.div
                            className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2"
                            variants={stepVariants}
                        >
                            <motion.div
                                className="order-2 md:order-1 md:text-right"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="inline-block rounded-2xl bg-gradient-to-br from-[#266055]/5 to-[#266055]/10 p-8 backdrop-blur-sm">
                                    <motion.div
                                        className="mb-4 inline-block rounded-xl bg-white p-4 shadow-lg"
                                        variants={iconVariants}
                                        whileHover={{ rotate: 5, scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <img src="/icons/get-solution.svg" alt="Dapatkan Solusi" className="h-16 w-16 object-contain" loading="lazy" />
                                    </motion.div>
                                </div>
                            </motion.div>
                            <motion.div
                                className="absolute left-1/2 top-1/2 z-5 hidden -translate-x-1/2 -translate-y-1/2 md:block"
                                variants={numberVariants}
                            >
                                <motion.div
                                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#266055] shadow-lg ring-4 ring-white"
                                    whileHover={{ scale: 1.15 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <span className="text-xl font-bold text-white">03</span>
                                </motion.div>
                            </motion.div>
                            <div className="order-1 md:order-2">
                                <div className="md:pl-8">
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#266055] md:hidden">
                                        <span className="text-lg font-bold text-white">03</span>
                                    </div>
                                    <h3 className="mb-3 text-2xl font-bold text-[#1b1b18]">Dapatkan Solusi</h3>
                                    <p className="text-md leading-relaxed text-gray-600">
                                        Terima laporan lengkap tentang hama yang terdeteksi beserta rekomendasi perawatan yang tepat.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
