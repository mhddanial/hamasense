'use client'

import { motion, type Variants } from 'framer-motion'
import { route } from 'ziggy-js';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
}

const titleVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    },
}

const textVariants: Variants = {
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

const buttonContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.4,
        },
    },
}

const buttonVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: 'easeOut' as const,
        },
    },
}

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
            <motion.div
                className="relative mx-auto max-w-4xl px-6 text-center text-white"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.h2
                    className="mb-4 text-3xl font-bold sm:text-4xl"
                    variants={titleVariants}
                >
                    Ingin Tahu Lebih Lanjut?
                </motion.h2>
                <motion.p
                    className="mt-4 text-base text-white/90 md:text-lg"
                    variants={textVariants}
                >
                    Hamasense terus berkembang untuk mendukung ekosistem kebun kota.
                    Terbuka untuk kolaborasi dengan komunitas, UMKM pangan segar, dan
                    pengelola ruang hijau urban.
                </motion.p>
                <motion.div
                    className="mt-8 flex flex-wrap justify-center gap-4"
                    variants={buttonContainerVariants}
                >
                    <motion.a
                        href="#"
                        className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-primary transition-colors hover:bg-gray-100"
                        variants={buttonVariants}
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Hubungi Kami
                    </motion.a>
                    <motion.a
                        href={route('detect.index')}
                        className="rounded-full border border-white/80 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-primary"
                        variants={buttonVariants}
                        whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Coba Sekarang
                    </motion.a>
                </motion.div>
            </motion.div>

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
