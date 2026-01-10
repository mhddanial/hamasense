'use client'
import { CircleCheckBigIcon } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
}

const imageVariants: Variants = {
    hidden: { opacity: 0, x: -60, scale: 0.95 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    },
}

const textContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
}

const headingVariants: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    },
}

const featureVariants: Variants = {
    hidden: { opacity: 0, x: 30, y: 10 },
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut' as const,
        },
    },
}

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
                <motion.div
                    className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    {/* Left: Image */}
                    <motion.div className="relative" variants={imageVariants}>
                        <div className="relative overflow-hidden rounded-3xl">
                            <motion.div
                                className="aspect-[4/3] w-full"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.4 }}
                            >
                                <img
                                    src={imageUrl}
                                    alt="Ilustrasi tanaman rusak karena hama"
                                    className="h-full w-full rounded-3xl object-cover"
                                    loading="lazy"
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                    {/* Right: Title & Features List */}
                    <motion.div
                        className="space-y-8"
                        variants={textContainerVariants}
                    >
                        <motion.div variants={headingVariants}>
                            <p className="mb-3 text-md font-bold uppercase tracking-wider text-[#266055]">
                                {eyebrow}
                            </p>
                            <h2 className="text-3xl font-bold leading-tight text-[#1b1b18] sm:text-4xl">
                                {title}
                            </h2>
                        </motion.div>
                        <ul className="space-y-6">
                            {features.map((feature, index) => (
                                <motion.li
                                    key={index}
                                    className="flex items-start gap-4"
                                    variants={featureVariants}
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <CircleCheckBigIcon className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                                    <p className="text-md leading-relaxed text-black">{feature}</p>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
