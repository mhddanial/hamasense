import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

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
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[rgb(38,96,85)] bg-radial-[at_50%_75%] from-slate-600 via-rgb(38,96,85) to-rgb(38,96,85) to-90% p-6 md:p-10">
            <div className="w-full max-w-md bg-white p-10 shadow-lg rounded-4xl">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-1">
                            <h1 className="text-sm text-muted-foreground">{title}</h1>
                            <p className="text-2xl font-medium">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
