'use client';

import { motion, type Variants } from 'framer-motion';

type HeroProps = {
    title: string;
    subtitle?: string;
    showPills?: boolean;
    className?: string;
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    },
};

const titleVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    },
};

const pillContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.8,
        },
    },
};

const pillVariants: Variants = {
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
};

export function Hero({ title, subtitle, showPills = true, className }: HeroProps) {
    return (
        <section className={`flex items-center justify-center px-6 py-20 lg:px-8 ${className ?? ''}`}>
            <motion.div
                className="max-w-5xl text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="mb-4 text-5xl font-semibold tracking-tight text-white lg:text-7xl pt-10 md:pt-0"
                    variants={titleVariants}
                    dangerouslySetInnerHTML={{ __html: title }}
                />
                {subtitle && (
                    <motion.p
                        className="mx-auto mb-4 max-w-2xl text-md leading-relaxed text-white/90 sm:text-xl"
                        variants={itemVariants}
                    >
                        {subtitle}
                    </motion.p>
                )}

                {showPills && (
                    <motion.div
                        className="flex flex-wrap items-center justify-center gap-3"
                        variants={pillContainerVariants}
                    >
                        <motion.div
                            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
                            variants={pillVariants}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                        >
                            ✓ Deteksi Real-time
                        </motion.div>
                        <motion.div
                            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
                            variants={pillVariants}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                        >
                            ✓ Akurasi Tinggi
                        </motion.div>
                        <motion.div
                            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
                            variants={pillVariants}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                        >
                            ✓ Mudah Digunakan
                        </motion.div>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
