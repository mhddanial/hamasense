import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from "@/types";
import { Pest } from "@/types/admin";
import {
    Filter,
    AlertTriangle,
    SearchX,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SearchBar from "@/components/SearchBar";

// Import Select Component (Shadcn/Radix pattern)
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import PestCardItem from "./PestCardItem";


interface Props {
    pests: Pest[];
}

export default function PestInfo({ pests }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Info Hama", href: route("pest.user.index") },
    ];

    const [search, setSearch] = useState("");
    const [kategori, setKategori] = useState("Semua Kategori");
    const [risiko, setRisiko] = useState("Semua Risiko");

    // Logic Filtering
    const filteredPests = pests.filter((p) => {
        const matchSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.scientific_name.toLowerCase().includes(search.toLowerCase()) ||
            (p.plant &&
                p.plant.some((plantName: string) =>
                    plantName.toLowerCase().includes(search.toLowerCase())
                ));

        const matchKategori = kategori === "Semua Kategori" || p.category === kategori;
        const matchRisiko = risiko === "Semua Risiko" || p.risk_level === risiko;

        return matchSearch && matchKategori && matchRisiko;
    });

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
                </section>

                <Separator />

                {/* --- FILTERS & SEARCH CONTROL --- */}
                <div className="rounded-lg border bg-card p-4 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">

                    {/* Search Bar */}
                    <div className="w-full md:w-1/3">
                        <SearchBar
                            value={search}
                            onChange={setSearch}
                            placeholder="Cari nama, ilmiah, atau tanaman..."
                            className="bg-white"
                        />
                    </div>

                    {/* Component Select Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

                        {/* Filter Kategori */}
                        <Select value={kategori} onValueChange={setKategori}>
                            <SelectTrigger className="w-full sm:w-[200px] bg-white">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Filter className="size-4" />
                                    <SelectValue placeholder="Kategori" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Semua Kategori">Semua Kategori</SelectItem>
                                <SelectItem value="Serangga">Serangga</SelectItem>
                                <SelectItem value="Jamur">Jamur</SelectItem>
                                <SelectItem value="Bakteri">Bakteri</SelectItem>
                                <SelectItem value="Virus">Virus</SelectItem>
                                <SelectItem value="Nematoda">Nematoda</SelectItem>
                                <SelectItem value="Gulma">Gulma</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Filter Risiko */}
                        <Select value={risiko} onValueChange={setRisiko}>
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
                    </div>
                </div>

                {/* --- PEST GRID LIST --- */}
                <div className="relative flex-1 min-h-[50vh]">
                    {filteredPests.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredPests.map((pest) => (
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
                                Coba ubah filter kategori, risiko, atau kata kunci pencarian Anda.
                            </p>
                            <Button
                                variant="link"
                                onClick={() => { setSearch(""); setKategori("Semua Kategori"); setRisiko("Semua Risiko"); }}
                                className="mt-2 text-primary"
                            >
                                Reset semua filter
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
