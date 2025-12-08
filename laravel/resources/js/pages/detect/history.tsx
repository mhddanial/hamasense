import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, List, Grid } from 'lucide-react';

// ===== INTERFACES =====
interface HistoryItem {
    id: number;
    plant_name: string;
    image_path: string;
    label: string | null;
    confidence: number | null;
    created_at: string;
    security_level: string;
}

interface Props {
    history?: {
        data: HistoryItem[];
        links: any[];
    }
}

// ===== DUMMY FALLBACK DATA (FULL VERSION) =====
const DUMMY_HISTORY: HistoryItem[] = [
    {
        id: 1,
        plant_name: "Tomat",
        image_path: "https://cdn8.dissolve.com/p/D869_27_632/D869_27_632_1200.jpg?w=400",
        label: "Healthy",
        confidence: 0.95,
        created_at: "2024-12-02T10:30:00",
        security_level: "Aman"
    },
    {
        id: 2,
        plant_name: "Cabai Merah",
        image_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwIAt0c5kFTmaRNBcGYCHZGR5aSTnrvhs-vg&s?w=400",
        label: "Late Blight",
        confidence: 0.87,
        created_at: "2024-12-01T15:45:00",
        security_level: "Berbahaya"
    },
    {
        id: 3,
        plant_name: "Selada Hijau",
        image_path: "https://source.roboflow.com/0ssLPmfXACUmPxrGZgo9MUYlW2H2/2ammXVFEqYw4v8gz6OxG/original.jpg?w=400",
        label: "Healthy",
        confidence: 0.92,
        created_at: "2024-11-30T09:15:00",
        security_level: "Aman"
    },
    {
        id: 4,
        plant_name: "Kentang",
        image_path: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtQFPgxBZb9DbM0HiSmPgaeJfwLuzWQB_rPA&s?w=400",
        label: "Early Blight",
        confidence: 0.78,
        created_at: "2024-11-29T14:20:00",
        security_level: "Waspada"
    },
    {
        id: 5,
        plant_name: "Paprika",
        image_path: "https://www.researchgate.net/publication/358987628/figure/fig1/AS:1129596795793410@1646328271744/Sample-bell-pepper-leaves-for-healthy-left-and-bacteria-spot-disease-right.jpg?w=400",
        label: "Healthy",
        confidence: 0.96,
        created_at: "2024-11-28T11:00:00",
        security_level: "Aman"
    },
];

// ===== MAIN COMPONENT =====
export default function DetectionHistory({ history }: Props) {

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Riwayat Deteksi', href: route('detect.history') },
    ];

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

    // Use database history OR fallback dummy
    const historyData = history?.data?.length ? history.data : DUMMY_HISTORY;

    // Searching
    const filtered = historyData.filter((item) =>
        item.plant_name.toLowerCase().includes(search.toLowerCase()) ||
        (item.label ?? "").toLowerCase().includes(search.toLowerCase())
    );

    // Sorting
    const sorted = [...filtered].sort((a, b) =>
        sortOrder === "newest"
            ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Colors
    const getSecurityColor = (level: string) => {
        switch (level) {
            case "Aman":
                return "bg-green-100 text-green-800 border-green-200";
            case "Waspada":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Berbahaya":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getImageSrc = (path: string) =>
        path.startsWith("http") ? path : `/storage/${path}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Deteksi" />

            <div className="flex min-h-screen w-full bg-[#F4F5F7]">
                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-6xl mx-auto">

                        {/* HEADER */}
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-bold">Riwayat Deteksi</h1>
                            <p className="text-gray-600 mt-2">
                                Semua riwayat pendeteksian tanaman Anda tersimpan di sini.
                            </p>
                        </div>

                        {/* SEARCH + FILTERS (1 ROW RESPONSIVE) */}
                        <div className="flex flex-col md:flex-row gap-3 mb-6">

                            {/* search */}
                            <div className="relative md:flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <Input
                                    placeholder="Cari tanaman atau penyakit..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 h-11 bg-white shadow-sm"
                                />
                            </div>

                            {/* sort */}
                            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as any)}>
                                <SelectTrigger className="h-11 bg-white shadow-sm md:w-48">
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Terbaru</SelectItem>
                                    <SelectItem value="oldest">Terlama</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* view mode */}
                            <div className="flex gap-2">
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    className="h-11 gap-2"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="w-4 h-4" /> List
                                </Button>
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    className="h-11 gap-2"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid className="w-4 h-4" /> Gambar
                                </Button>
                            </div>

                        </div>

                        {/* LIST / GRID DISPLAY */}
                        {sorted.length === 0 ? (
                            <p className="text-center text-gray-500 py-10">Tidak ada hasil ditemukan.</p>
                        ) : viewMode === "list" ? (
                            
                            /* ===== LIST VIEW ===== */
                            <div className="space-y-4 ">
                                {sorted.map((item) => (
                                    <Link key={item.id} href={route("detect.history.detail", item.id)}>
                                        <Card className="p-4 mb-2 bg-white rounded-xl shadow-sm hover:shadow-lg transition border hover:border-gray-300">
                                            <div className="flex gap-4 items-center">
                                                {/* IMAGE */}
                                                <img
                                                    src={getImageSrc(item.image_path)}
                                                    className="w-24 h-24 rounded-xl object-cover shadow-sm border"
                                                />
                                                {/* BODY */}
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold">{item.plant_name}</h3>

                                                    <div className="flex gap-2 mt-1 flex-wrap">
                                                        <Badge variant="secondary">{item.label ?? "Tidak diketahui"}</Badge>
                                                        <Badge className={getSecurityColor(item.security_level)}>
                                                            {item.security_level}
                                                        </Badge>
                                                    </div>

                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Akurasi: <strong>{Math.round((item.confidence ?? 0) * 100)}%</strong>
                                                    </p>
                                                </div>

                                                {/* DATE (DESKTOP ONLY) */}
                                                <div className="hidden md:block text-right text-sm text-gray-500">
                                                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                                                    <div className="text-xs">
                                                        {new Date(item.created_at).toLocaleTimeString("id-ID", {
                                                            hour: "2-digit", minute: "2-digit"
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                        ) : (

                            /* ===== GRID VIEW ===== */
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {sorted.map((item) => (
                                    <Link key={item.id} href={route("detect.history.detail", item.id)}>
                                        <Card className="overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl transition border group py-0">
                                            {/* IMG */}
                                            <div className="relative">
                                                <img
                                                    src={getImageSrc(item.image_path)}
                                                    className="h-40 w-full object-cover group-hover:scale-105 transition duration-300"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <Badge className={getSecurityColor(item.security_level)}>
                                                        {item.security_level}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="pb-4">
                                                <p className="font-semibold truncate">{item.plant_name}</p>
                                                <Badge variant="secondary" className="text-xs mt-1 mb-2">
                                                    {item.label ?? "Tidak diketahui"}
                                                </Badge>

                                                <div className="text-xs text-gray-500 flex justify-between mt-2">
                                                    <span>{Math.round((item.confidence ?? 0) * 100)}% akurat</span>
                                                    <span>{new Date(item.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short"})}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>

                        )}

                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
