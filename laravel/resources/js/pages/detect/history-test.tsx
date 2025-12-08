import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Badge } from '@/components/ui/badge';

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
    }
}

export default function DetectionHistory({ history }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Riwayat Deteksi',
            href: route('detect.history'),
        },
    ];

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");

    // Filter by search
    const filtered = history.data.filter((item) =>
        (item.label || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Deteksi" />

            <div className="flex min-h-screen w-full bg-[#F4F5F7]">
                <main className="flex-1 p-5 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-2xl font-bold">Riwayat Deteksi</h1>
                        <p className="text-gray-600 mb-10">
                            Riwayat hasil pendeteksian tanaman Anda.
                        </p>

                        <div className="p-8 rounded-lg bg-white shadow-sm">

                            {/* Section: Search + View Mode */}
                            <div className="flex items-center justify-between mb-6">
                                <SearchBar value={search} onChange={setSearch} />

                                <div className="flex gap-2">
                                    <Badge
                                        variant={viewMode === "list" ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => setViewMode("list")}
                                    >
                                        List
                                    </Badge>

                                    <Badge
                                        variant={viewMode === "grid" ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        Gambar
                                    </Badge>
                                </div>
                            </div>

                            {/* CONTENT */}
                            {viewMode === "list" ? (
                                <div className="space-y-4">
                                    {filtered.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route("detect.history.detail", item.id)}
                                            className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                                        >
                                            <img
                                                src={`/storage/${item.image_path}`}
                                                className="w-20 h-20 object-cover rounded-lg border"
                                            />

                                            <div className="flex-1">
                                                <p className="text-lg font-semibold">
                                                    {item.label ?? "Tidak diketahui"}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Akurasi: {Math.round((item.confidence ?? 0) * 100)}%
                                                </p>
                                            </div>

                                            <p className="text-sm text-gray-400">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {filtered.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={route("detect.history.detail", item.id)}
                                            className="block"
                                        >
                                            <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                                                <img
                                                    src={`/storage/${item.image_path}`}
                                                    className="h-40 w-full object-cover"
                                                />
                                                <div className="p-3">
                                                    <p className="font-semibold text-sm">
                                                        {item.label ?? "Tidak diketahui"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Pagination (opsional) */}
                        </div>
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
