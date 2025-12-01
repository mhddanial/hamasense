import { useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { type BreadcrumbItem } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Camera, Clock8, Bug, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Import Komponen Custom
import LiveClock from "@/components/live-clock";
import WeatherWidget from "@/components/weather-widget";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Dashboard",
        href: dashboard().url,
    },
];

const shortcuts = [
    {
        icon: <Camera className="h-5 w-5" />,
        title: "Deteksi Hama Baru",
        desc: "Foto tanaman dan dapatkan analisa AI",
    },
    {
        icon: <Clock8 className="h-5 w-5" />,
        title: "Lihat Riwayat",
        desc: "Lihat dan pantau riwayat deteksi",
    },
    {
        icon: <Bug className="h-5 w-5" />,
        title: "Pelajari Hama",
        desc: "Telusuri dan pelajari jenis hama",
    },
];

const articles = [
    {
        label: "Pencegahan",
        title: "Cara Mencegah Serangan Kutu Daun di Musim Hujan",
        desc: "Tips praktis mencegah serangan kutu daun ketika kelembaban tinggi.",
    },
    {
        label: "Edukasi",
        title: "Mengenal Thrips: Hama Kecil dengan Dampak Besar",
        desc: "Pelajari cara mengenali dan mengendalikan thrips pada tanaman Anda.",
    },
];

type DashboardProps = {
    user: { name: string };
    weather: any; 
};

export default function Dashboard({ user, weather }: DashboardProps) {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden rounded-xl p-4 md:px-12">
                {/* --- HEADER SECTION --- */}
                <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="space-y-1">
                        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                            Selamat Datang, {user.name} 🙌
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Pantau kesehatan tanaman Anda dengan teknologi AI terdepan.
                        </p>
                    </div>
                    {/* Jam Realtime */}
                    <div className="self-start md:self-center">
                        <LiveClock />
                    </div>
                </section>

                <div className="relative flex-1 overflow-visible rounded-xl">
                    <div className="space-y-8">
                        {/* --- Widget cuaca --- */}
                        <section>
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-lg font-semibold tracking-tight">Kondisi Cuaca Saat Ini</h3>
                            </div>
                            <WeatherWidget weather={weather} />
                        </section>

                        <Separator />

                        {/* --- SHORTCUTS MENU --- */}
                        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {shortcuts.map((item) => (
                                <Card
                                    key={item.title}
                                    className="group cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <CardContent className="flex items-center gap-3 px-4 py-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 space-y-0.5">
                                            <CardTitle className="text-sm font-semibold">
                                                {item.title}
                                            </CardTitle>
                                            <CardDescription className="text-xs text-muted-foreground">
                                                {item.desc}
                                            </CardDescription>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5" />
                                    </CardContent>
                                </Card>
                            ))}
                        </section>

                        {/* --- STATISTIK & ARTIKEL (Grid 2 Kolom) --- */}
                        <div className="grid gap-6 lg:grid-cols-3">
                            
                            {/* Kiri: Statistik Ringkas (2/3 layar) */}
                            <div className="space-y-6 lg:col-span-2">
                                <Card>
                                    <CardHeader className="space-y-1 pb-4">
                                        <CardTitle className="text-base font-semibold">
                                            Ringkasan Deteksi
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Data 30 hari terakhir.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Total Scan</p>
                                            <p className="mt-1 text-2xl font-semibold">0</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Terdeteksi Sakit</p>
                                            <p className="mt-1 text-2xl font-semibold text-rose-600">0</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Sehat</p>
                                            <p className="mt-1 text-2xl font-semibold text-emerald-600">0</p>
                                        </div>
                                    </CardContent>
                                </Card>
                                
                                {/* Artikel */}
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold">Rekomendasi Bacaan</h4>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {articles.map((article) => (
                                            <Card key={article.title} className="flex flex-col justify-between overflow-hidden">
                                                <CardContent className="p-4 space-y-2">
                                                    <Badge variant="outline" className="text-[10px]">{article.label}</Badge>
                                                    <h5 className="text-sm font-semibold leading-tight">{article.title}</h5>
                                                    <p className="text-xs text-muted-foreground line-clamp-2">{article.desc}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Kanan: Status Perawatan (1/3 layar) */}
                            <div className="lg:col-span-1">
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold">Status Perawatan</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex h-[200px] flex-col items-center justify-center text-center">
                                        <div className="rounded-full bg-muted p-3 mb-3">
                                            <Bug className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Tidak ada tanaman dalam perawatan intensif.
                                        </p>
                                        <Button variant="link" size="sm" className="mt-2 text-emerald-700">
                                            Mulai Deteksi Baru
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}