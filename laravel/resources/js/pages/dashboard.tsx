import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import {
    Thermometer,
    Droplets,
    Wind,
    CloudHail,
    Camera,
    Clock8,
    Bug,
    ChevronRight,
} from "lucide-react";

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

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

type Article = {
    label: string;
    title: string;
    desc: string;
};

const articles: Article[] = [
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

const weatherSummary = {
    city: "Kota Batam",
    riskLevel: "Tinggi",
    riskLabel: "Risiko Hama Tinggi",
    temp: "32°C",
    humidity: "85%",
    wind: "12 km/jam",
    lastUpdate: "Terakhir diperbarui • 12 Jan 2025, 10:24",
    recommendation:
        "Lakukan pemantauan ekstra pada daun bagian bawah dan area lembap. Pertimbangkan penyemprotan fungisida ringan pada tanaman rentan dalam 24 jam ke depan.",
};


type DashboardProps = {
    user: { name: string };
};

export default function Dashboard({ user }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Dashboard" />
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-hidden rounded-xl p-4 md:px-12">
            {/* HEADER */}
            <section className="space-y-1">
                <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                    Selamat Datang, {user.name} 🙌
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground">
                    Pantau kesehatan tanaman Anda dengan teknologi AI terdepan.
                </p>
            </section>

            <div className="relative flex-1 overflow-visible rounded-xl">
                <div className="space-y-6">
                    {/* SHORTCUTS */}
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {shortcuts.map((item) => (
                        <Card
                        key={item.title}
                        className="group cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <CardContent className="flex items-center gap-3 px-4">
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

                    {/* PERAWATAN & RINGKASAN RIWAYAT */}
                    <section className="grid gap-6 md:grid-cols-2">
                        {/* CARD LANJUTKAN PERAWATAN */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle className="text-base font-semibold">
                                    Lanjutkan Perawatan
                                </CardTitle>
                                <Button variant="link" size="sm" className="px-0 text-emerald-700">
                                    Lihat Semua
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {/* Nanti bisa diganti list perawatan aktif */}
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    Tidak ada perawatan yang sedang berlangsung.
                                </p>
                            </CardContent>
                        </Card>

                        {/* CARD RINGKASAN RIWAYAT */}
                        <Card>
                            <CardHeader className="space-y-1 pb-4">
                                <CardTitle className="text-base font-semibold">
                                    Ringkasan Riwayat
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Ringkasan deteksi dalam 30 hari terakhir.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Deteksi</p>
                                    <p className="mt-1 text-2xl font-semibold">0</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Tanaman Sembuh</p>
                                    <p className="mt-1 text-2xl font-semibold text-emerald-600">
                                        0
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Akurasi Keseluruhan</p>
                                    <p className="mt-1 text-2xl font-semibold">–</p>
                                </div>
                            </CardContent>
                            <CardFooter className="justify-end">
                                <span className="text-xs text-muted-foreground">
                                    Mulai deteksi untuk melihat ringkasan performa AI.
                                </span>
                            </CardFooter>
                        </Card>
                    </section>

                    {/* ARTIKEL */}
                    <section className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="text-sm font-semibold">Lihat Artikel</h4>
                            <Button
                            variant="link"
                            size="sm"
                            className="px-0 text-emerald-700"
                            >
                                Lihat Semua
                            </Button>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {articles.map((article) => (
                            <Card
                                key={article.title}
                                className="flex flex-col gap-4 sm:flex-row"
                            >
                                <div className="h-32 w-full overflow-hidden rounded-xl bg-muted sm:h-auto sm:w-28 sm:rounded-l-xl" />
                                {/* gambar bisa diisi src dari backend nanti */}
                                <CardContent className="flex flex-1 flex-col justify-between space-y-2 p-4">
                                    <div className="space-y-1">
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                                            >
                                            {article.label}
                                        </Badge>
                                        <h5 className="mt-1 text-sm font-semibold">
                                            {article.title}
                                        </h5>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {article.desc}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="sm" className="self-start px-0 text-xs">
                                        Baca selengkapnya
                                    </Button>
                                </CardContent>
                            </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
        </AppLayout>
    );
    }