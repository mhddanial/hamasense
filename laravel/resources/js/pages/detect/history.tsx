import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { LayoutGrid, List, SearchX, Calendar, CheckCircle2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";

// Import UI Components (Hanya Button, Badge, Separator)
// Kita menghapus Card dari Shadcn sesuai permintaan
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface HistoryItem {
    id: number;
    image_path: string;
    label: string | null;
    confidence: number | null;
    created_at: string;
}

interface Props {
    history: {
        data: HistoryItem[];
        links: any[];
    };
    filters?: {
        search?: string;
    }
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Riwayat Deteksi",
        href: route("detect.history"),
    },
];

export default function DetectionHistory({ history, filters }: Props) {
    const [search, setSearch] = useState(filters?.search || "");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    // Client-side filtering logic
    const filtered = history.data.filter((item) =>
        (item.label || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Deteksi" />

            {/* MAIN WRAPPER */}
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden rounded-xl p-4 md:px-12">
                
                {/* --- HEADER SECTION --- */}
                <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="space-y-1">
                        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                            Riwayat Deteksi
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Arsip hasil analisis dan diagnosa tanaman Anda.
                        </p>
                    </div>
                    
                    {/* View Toggles */}
                    <div className="items-center gap-2 bg-muted/50 p-1 rounded-lg border hidden md:flex">
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="h-8 px-3"
                        >
                            <List className="mr-2 h-4 w-4" />
                            List
                        </Button>
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="h-8 px-3"
                        >
                            <LayoutGrid className="mr-2 h-4 w-4" />
                            Grid
                        </Button>
                    </div>
                </section>

                <Separator />

                {/* --- CONTROLS SECTION --- */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="w-full sm:max-w-md">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder="Cari berdasarkan nama tanaman..."
                            className="bg-background"
                        />
                    </div>
                    
                    <div className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
                        Menampilkan <strong>{filtered.length}</strong> data
                    </div>
                </div>

                {/* --- CONTENT AREA --- */}
                <div className="relative flex-1 overflow-visible rounded-xl min-h-[50vh]">
                    {filtered.length > 0 ? (
                        <div className="space-y-8">
                            
                            {viewMode === "list" ? (
                                /* LIST VIEW - Menggunakan Div manual + Tailwind */
                                <div className="grid gap-4">
                                    {filtered.map((item) => (
                                        <Link 
                                            key={item.id} 
                                            href={route("detect.history.detail", item.id)}
                                            className="group relative flex flex-col sm:flex-row overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                                        >
                                            {/* Image Section */}
                                            <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 bg-muted">
                                                <img
                                                    src={`/storage/${item.image_path}`}
                                                    alt={item.label || "Deteksi"}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                            
                                            {/* Text Content */}
                                            <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">
                                                            {item.label ?? "Tidak diketahui"}
                                                        </h3>
                                                        <Badge variant={item.confidence && item.confidence > 0.8 ? "default" : "secondary"}>
                                                            {Math.round((item.confidence ?? 0) * 100)}% Akurat
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4 flex items-center justify-end">
                                                    <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                                                        Lihat Detail <CheckCircle2 className="h-3 w-3" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                /* GRID VIEW - Menggunakan Div manual + Tailwind */
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {filtered.map((item) => (
                                        <Link 
                                            key={item.id} 
                                            href={route("detect.history.detail", item.id)}
                                            className="group block rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 h-full"
                                        >
                                            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                                <img
                                                    src={`/storage/${item.image_path}`}
                                                    alt={item.label || ""}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <Badge variant="secondary" className="bg-black/60 text-white hover:bg-black/70 backdrop-blur-sm border-0">
                                                        {Math.round((item.confidence ?? 0) * 100)}%
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="p-4 flex-1">
                                                <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                                                    {item.label ?? "Tidak diketahui"}
                                                </h3>
                                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            <div className="flex justify-center pt-6 pb-8">
                                <div className="flex flex-wrap gap-1 justify-center">
                                    {history.links.map((link, index) => (
                                        link.url ? (
                                            <Link key={index} href={link.url}>
                                                <Button
                                                    variant={link.active ? "default" : "outline"}
                                                    size="sm"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            </Link>
                                        ) : (
                                            <Button
                                                key={index}
                                                variant="ghost"
                                                size="sm"
                                                disabled
                                                className="text-muted-foreground"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* EMPTY STATE - Manual Div */
                        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-xl bg-slate-50/50">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <SearchX className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">Tidak ada riwayat ditemukan</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                Kami tidak dapat menemukan data yang cocok dengan "{search}".
                            </p>
                            <Button 
                                variant="link" 
                                onClick={() => setSearch("")}
                                className="mt-2 text-primary"
                            >
                                Hapus filter pencarian
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}