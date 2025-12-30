import { useState, useEffect } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from "@/types";
import { Pest, Category } from "@/types/admin";
import {
    Filter,
    AlertTriangle,
    SearchX,
    Search,
    Loader2,
    RefreshCw,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

// Import Select Component (Shadcn/Radix pattern)
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PestCardItem from "./PestCardItem";

interface Filters {
    search?: string;
    category?: string;
    risk?: string;
}

interface Props {
    pests: Pest[];
    categories: Category[];
    filters?: Filters;
}

export default function PestInfo({ pests, categories, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Info Hama", href: route("pest.user.index") },
    ];

    // Initialize state from server-side filters
    const [search, setSearch] = useState(filters?.search || "");
    const [kategori, setKategori] = useState(filters?.category || "Semua Kategori");
    const [risiko, setRisiko] = useState(filters?.risk || "Semua Risiko");
    const [isLoading, setIsLoading] = useState(false);

    // Helper untuk warna badge risiko
    const getRiskColor = (level: string) => {
        switch (level.toLowerCase()) {
            case 'tinggi': return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
            case 'sedang': return "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200";
            case 'rendah': return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    // Helper untuk label risiko
    const getRiskLabel = (level: string) => {
        switch (level.toLowerCase()) {
            case 'tinggi': return 'Tinggi';
            case 'sedang': return 'Sedang';
            case 'rendah': return 'Rendah';
            default: return level;
        }
    };

    // Handle search with server-side request
    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        setIsLoading(true);

        router.get('/pest-info', {
            search: search || undefined,
            category: kategori !== "Semua Kategori" ? kategori : undefined,
            risk: risiko !== "Semua Risiko" ? risiko : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Handle filter change with immediate search
    const handleFilterChange = (type: 'category' | 'risk', value: string) => {
        if (type === 'category') {
            setKategori(value);
        } else {
            setRisiko(value);
        }

        setIsLoading(true);

        router.get('/pest-info', {
            search: search || undefined,
            category: type === 'category'
                ? (value !== "Semua Kategori" ? value : undefined)
                : (kategori !== "Semua Kategori" ? kategori : undefined),
            risk: type === 'risk'
                ? (value !== "Semua Risiko" ? value : undefined)
                : (risiko !== "Semua Risiko" ? risiko : undefined),
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Handle reset filters
    const handleResetFilters = () => {
        setSearch("");
        setKategori("Semua Kategori");
        setRisiko("Semua Risiko");
        setIsLoading(true);

        router.get('/pest-info', {}, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Check if any filter is active
    const hasActiveFilters = search || kategori !== "Semua Kategori" || risiko !== "Semua Risiko";

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Informasi Hama" />

            {/* MAIN WRAPPER */}
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-hidden rounded-xl p-4 md:px-12">

                {/* --- HEADER SECTION --- */}
                <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="space-y-1">
                        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                            Ensiklopedia Hama & Penyakit
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Katalog lengkap identifikasi, gejala, dan solusi penanganan hama tanaman.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            {pests.length} hama ditemukan
                        </span>
                    </div>
                </section>

                <Separator />

                {/* --- FILTERS & SEARCH CONTROL --- */}
                <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">

                    {/* Search Bar with Button */}
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-2/5">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atau nama ilmiah..."
                                className="pl-10 bg-white"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                            <span className="ml-2 hidden sm:inline">Cari</span>
                        </Button>
                    </form>

                    {/* Component Select Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

                        {/* Filter Kategori */}
                        <Select value={kategori} onValueChange={(v) => handleFilterChange('category', v)}>
                            <SelectTrigger className="w-full sm:w-[200px] bg-white">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Filter className="size-4" />
                                    <SelectValue placeholder="Kategori" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Semua Kategori">Semua Kategori</SelectItem>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Filter Risiko */}
                        <Select value={risiko} onValueChange={(v) => handleFilterChange('risk', v)}>
                            <SelectTrigger className="w-full sm:w-[200px] bg-white">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <AlertTriangle className="size-4" />
                                    <SelectValue placeholder="Risiko" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Semua Risiko">Semua Risiko</SelectItem>
                                <SelectItem value="rendah">Rendah</SelectItem>
                                <SelectItem value="sedang">Sedang</SelectItem>
                                <SelectItem value="tinggi">Tinggi</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Reset Button */}
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleResetFilters}
                                disabled={isLoading}
                                className="shrink-0"
                                title="Reset semua filter"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </Button>
                        )}
                    </div>
                </div>

                {/* --- PEST GRID LIST --- */}
                <div className="relative flex-1 min-h-[50vh]">
                    {/* Loading Overlay */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                            <div className="flex flex-col items-center gap-3">
                                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground font-medium">Mencari hama...</p>
                            </div>
                        </div>
                    )}

                    {pests.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {pests.map((pest) => (
                                <PestCardItem key={pest.id} pest={pest} getRiskColor={getRiskColor} getRiskLabel={getRiskLabel} />
                            ))}
                        </div>
                    ) : (
                        /* EMPTY STATE */
                        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl bg-slate-50/50">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <SearchX className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold">Hama atau penyakit tidak ditemukan</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                {hasActiveFilters
                                    ? "Coba ubah filter kategori, risiko, atau kata kunci pencarian Anda."
                                    : "Belum ada data hama yang tersedia saat ini."}
                            </p>
                            {hasActiveFilters && (
                                <Button
                                    variant="default"
                                    onClick={handleResetFilters}
                                    className="mt-4"
                                    disabled={isLoading}
                                >
                                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                    Reset semua filter
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
