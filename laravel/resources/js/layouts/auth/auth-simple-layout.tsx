import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren, useEffect, useState } from 'react';


interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const tips = [
        "Identifikasi hama dan penyakit tanaman secara instan hanya dengan kamera Anda. Dapatkan solusi perawatan yang direkomendasikan untuk panen yang lebih baik.",
        "Cukup ambil foto daun atau buah yang bermasalah untuk mengidentifikasi hama dan penyakit. Terima panduan langkah demi langkah untuk penanganan yang efektif dan panen yang lebih melimpah.",
        "Unggah foto tanaman Anda dan dapatkan analisis mendalam dari AI kami dalam hitungan detik. Atasi masalah sejak dini dengan solusi teruji untuk pertumbuhan tanaman yang optimal.",
    ];

    const [currentTipIndex, setCurrentTipIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
                setIsAnimating(false);
            }, 500);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[rgb(38,96,85)] bg-radial-[at_50%_75%] from-slate-700 via-rgb(38,96,85) to-rgb(38,96,85) to-90%">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 md:mt-25">
                <div className="p-8 md:p-12 lg:px-16 lg:py-12">
                    <div className="hidden md:block mx-auto max-w-lg text-center ltr:sm:text-left">
                        <div className='flex justify-start items-center gap-5 mb-4'>
                            <AppLogoIcon className="h-15 fill-current text-white"/>
                            <h2 className='text-3xl font-bold text-white font-logo'>HAMASENSE</h2>
                        </div>
                        <h2 className="text-5xl font-bold text-white">
                            Masa Depan Pertanian di Tangan Anda.
                        </h2>
                        <div className="backdrop-blur-sm overflow-hidden md:block mt-7">
                            <div 
                                className={`text-neutral-100 text-md font-medium transition-all duration-500 ${
                                    isAnimating ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'
                                }`}
                            >
                                {tips[currentTipIndex]}
                            </div>
                            <div className="flex justify-start gap-1.5 mt-5">
                                {tips.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                            index === currentTipIndex 
                                                ? 'w-8 bg-white' 
                                                : 'w-1.5 bg-white/40'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="max-w-md bg-white md:p-10 p-7 shadow-lg rounded-t-3xl">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-1">
                                <h1 className="text-sm text-muted-foreground dark:font-bold">{title}</h1>
                                <p className="text-2xl font-medium dark:text-background">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}