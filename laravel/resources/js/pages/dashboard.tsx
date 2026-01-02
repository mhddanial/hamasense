import { useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { dashboard } from "@/routes";
import { type BreadcrumbItem } from "@/types";
import { Head, usePage, Link } from "@inertiajs/react";
import { Camera, Clock8, Bug, ChevronRight, FileText, AlertTriangle, CheckCircle2, Activity, ArrowRight } from "lucide-react";
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
        href: "/detect",
    },
    {
        icon: <Clock8 className="h-5 w-5" />,
        title: "Lihat Riwayat",
        desc: "Lihat dan pantau riwayat deteksi",
        href: "/detect-history",
    },
    {
        icon: <Bug className="h-5 w-5" />,
        title: "Pelajari Hama",
        desc: "Telusuri dan pelajari jenis hama",
        href: "/pest",
    },
];

// Types
interface Stats {
    totalDetections: number;
    healthyDetections: number;
    diseasedDetections: number;
}

interface RecentDetection {
    id: number;
    label: string;
    confidence: number | null;
    image_path: string | null;
    created_at: string;
}

interface ActiveCase {
    id: number;
    plant_name: string;
    pest_name: string;
    status: string;
    created_at: string;
}

interface ArticleItem {
    id: number;
    title: string;
    slug: string;
    summary: string | null;
    category: string;
    image: string | null;
}

type DashboardProps = {
    user: { name: string };
    weather: any;
    stats: Stats;
    recentDetections: RecentDetection[];
    activeCases: ActiveCase[];
    articles: ArticleItem[];
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'bg-amber-100 text-amber-700';
        case 'in_progress':
            return 'bg-blue-100 text-blue-700';
        case 'monitoring':
            return 'bg-emerald-100 text-emerald-700';
        default:
            return 'bg-gray-100 text-gray-700';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Menunggu';
        case 'in_progress':
            return 'Dalam Proses';
        case 'monitoring':
            return 'Monitoring';
        default:
            return status;
    }
};

export default function Dashboard({
    user,
    weather,
    stats = { totalDetections: 0, healthyDetections: 0, diseasedDetections: 0 },
    recentDetections = [],
    activeCases = [],
    articles = []
}: DashboardProps) {
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
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-lg font-semibold tracking-tight">Pintasan Menu</h3>
                        </div>
                        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {shortcuts.map((item) => (
                                <Link key={item.title} href={item.href}>
                                    <Card
                                        className="group cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <CardContent className="flex items-center gap-3 px-4 py-2">
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
                                </Link>
                            ))}
                        </section>

                        {/* --- STATISTIK & CONTENT (Grid 2 Kolom) --- */}
                        <div className="grid gap-6 lg:grid-cols-3">

                            {/* Kiri: Statistik & Recent (2/3 layar) */}
                            <div className="space-y-6 lg:col-span-2">
                                {/* Detection Summary */}
                                <Card>
                                    <CardHeader className="space-y-1 pb-4">
                                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-emerald-600" />
                                            Ringkasan Deteksi
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Data 30 hari terakhir.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-3 gap-4 text-center">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-center">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                                                    <Camera className="h-4 w-4 text-blue-600" />
                                                </div>
                                            </div>
                                            <p className="text-2xl font-semibold">{stats.totalDetections}</p>
                                            <p className="text-xs text-muted-foreground">Total Deteksi</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-center">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50">
                                                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                                                </div>
                                            </div>
                                            <p className="text-2xl font-semibold text-rose-600">{stats.diseasedDetections}</p>
                                            <p className="text-xs text-muted-foreground">Terdeteksi Sakit</p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-center">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                </div>
                                            </div>
                                            <p className="text-2xl font-semibold text-emerald-600">{stats.healthyDetections}</p>
                                            <p className="text-xs text-muted-foreground">Sehat</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Recent Detections */}
                                {recentDetections.length > 0 && (
                                    <Card>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base font-semibold">Deteksi Terbaru</CardTitle>
                                                <Link href="/detect-history">
                                                    <Button variant="ghost" size="sm" className="text-xs text-emerald-700">
                                                        Lihat Semua <ArrowRight className="ml-1 h-3 w-3" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            {recentDetections.slice(0, 3).map((detection) => (
                                                <div
                                                    key={detection.id}
                                                    className="flex items-center justify-between rounded-lg border p-3 transition hover:bg-muted/50"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                                            <Bug className="h-5 w-5 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium">{detection.label}</p>
                                                            <p className="text-xs text-muted-foreground">{detection.created_at}</p>
                                                        </div>
                                                    </div>
                                                    {detection.confidence !== null && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {detection.confidence}%
                                                        </Badge>
                                                    )}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Artikel Rekomendasi */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-semibold">Rekomendasi Bacaan</h4>
                                        <a href="/articles" target="_blank" rel="noopener noreferrer">
                                            <Button variant="ghost" size="sm" className="text-xs text-emerald-700">
                                                Lihat Semua <ArrowRight className="ml-1 h-3 w-3" />
                                            </Button>
                                        </a>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {articles.length > 0 ? (
                                            articles.map((article) => (
                                                <a key={article.id} href={`/articles/${article.slug}`} target="_blank" rel="noopener noreferrer">
                                                    <Card className="group flex flex-col justify-between overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
                                                        {/* Mini Image Preview */}
                                                        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                                                            <img
                                                                src={article.image || '/images/why-choose-us.png'}
                                                                alt={article.title}
                                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                                            <Badge
                                                                variant="secondary"
                                                                className="absolute bottom-2 left-2 text-[10px] bg-white/90 text-gray-700"
                                                            >
                                                                {article.category}
                                                            </Badge>
                                                        </div>
                                                        <CardContent className="p-3 space-y-1">
                                                            <h5 className="text-sm font-semibold leading-tight line-clamp-2">{article.title}</h5>
                                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                                {article.summary || 'Baca selengkapnya...'}
                                                            </p>
                                                        </CardContent>
                                                    </Card>
                                                </a>
                                            ))
                                        ) : (
                                            <>
                                                <Card className="flex flex-col justify-between overflow-hidden">
                                                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                                                        <img
                                                            src="/images/why-choose-us.png"
                                                            alt="Placeholder"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <CardContent className="p-3 space-y-1">
                                                        <Badge variant="outline" className="text-[10px]">Pencegahan</Badge>
                                                        <h5 className="text-sm font-semibold leading-tight">Cara Mencegah Serangan Kutu Daun di Musim Hujan</h5>
                                                        <p className="text-xs text-muted-foreground line-clamp-2">Tips praktis mencegah serangan kutu daun ketika kelembaban tinggi.</p>
                                                    </CardContent>
                                                </Card>
                                                <Card className="flex flex-col justify-between overflow-hidden">
                                                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                                                        <img
                                                            src="/images/why-choose-us.png"
                                                            alt="Placeholder"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <CardContent className="p-3 space-y-1">
                                                        <Badge variant="outline" className="text-[10px]">Edukasi</Badge>
                                                        <h5 className="text-sm font-semibold leading-tight">Mengenal Thrips: Hama Kecil dengan Dampak Besar</h5>
                                                        <p className="text-xs text-muted-foreground line-clamp-2">Pelajari cara mengenali dan mengendalikan thrips pada tanaman Anda.</p>
                                                    </CardContent>
                                                </Card>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Kanan: Active Cases (1/3 layar) */}
                            <div className="lg:col-span-1">
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            Status Perawatan
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {activeCases.length > 0 ? (
                                            <div className="space-y-3">
                                                {activeCases.map((caseItem) => (
                                                    <Link key={caseItem.id} href={`/cases/${caseItem.id}`}>
                                                        <div className="rounded-lg border p-3 transition hover:bg-muted/50 mb-2">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <p className="text-sm font-medium">{caseItem.plant_name}</p>
                                                                <Badge className={`text-[10px] ${getStatusColor(caseItem.status)}`}>
                                                                    {getStatusLabel(caseItem.status)}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-muted-foreground">{caseItem.pest_name}</p>
                                                            <p className="text-xs text-muted-foreground mt-1">{caseItem.created_at}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                                <Link href="/cases">
                                                    <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                                                        Lihat Semua Case
                                                    </Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-center py-4">
                                                <div className="rounded-full bg-muted p-3 mb-3">
                                                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                                </div>
                                                <p className="text-sm font-medium text-emerald-700 mb-1">
                                                    Semua Baik!
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Tidak ada tanaman dalam perawatan intensif.
                                                </p>
                                                <Link href="/detect">
                                                    <Button variant="link" size="sm" className="mt-2 text-emerald-700">
                                                        Mulai Deteksi Baru
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
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
