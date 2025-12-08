import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/filterDropdown";
import PestList from "@/components/pestList";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from "@/types";

export default function PestInfo() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Info Hama", href: route("pest.index") },
    ];

    const pests = [
        {
            id: 1,
            nama: "Tungau Laba-laba",
            namaIlmiah: "Tetranychidae",
            kategori: "Tungau",
            risiko: "Sedang",
            gambar: "https://images.unsplash.com/photo-1611095965920-6cd727c3c1a5?q=80&w=800&auto=format&fit=crop",
            tanaman: ["Tomat", "Paprika", "Cabai"],
        },
        {
            id: 2,
            nama: "Ulat Grayak",
            namaIlmiah: "Spodoptera litura",
            kategori: "Ulat",
            risiko: "Berat",
            gambar: "https://images.unsplash.com/photo-1615800096573-099035c157d8?q=80&w=800&auto=format&fit=crop",
            tanaman: ["Padi", "Jagung", "Kedelai"],
        },
        {
            id: 3,
            nama: "Ulat Hijau",
            namaIlmiah: "Plutella xylostella",
            kategori: "Ulat",
            risiko: "Berat",
            gambar: "https://images.unsplash.com/photo-1524593119770-7fed202b6581?q=80&w=800&auto=format&fit=crop",
            tanaman: ["Padi", "Jagung", "Kedelai"],
        },
        {
            id: 4,
            nama: "Belalang Hijau",
            namaIlmiah: "Caelifera",
            kategori: "Belalang",
            risiko: "Berat",
            gambar: "https://images.unsplash.com/photo-1561461195-4bcf66c7f6ed?q=80&w=800&auto=format&fit=crop",
            tanaman: ["Padi", "Jagung", "Kedelai"],
        },
    ];

    // === FILTER STATE ===
    const [search, setSearch] = useState("");
    const [kategori, setKategori] = useState("Semua Kategori");
    const [risiko, setRisiko] = useState("Semua Risiko");

    // === FILTER LOGIC ===
    const filteredPests = pests.filter((p) => {
        const matchSearch =
            p.nama.toLowerCase().includes(search.toLowerCase()) ||
            p.namaIlmiah.toLowerCase().includes(search.toLowerCase()) ||
            p.tanaman.some((t) => t.toLowerCase().includes(search.toLowerCase()));

        const matchKategori =
            kategori === "Semua Kategori" || p.kategori === kategori;

        const matchRisiko =
            risiko === "Semua Risiko" || p.risiko === risiko;

        return matchSearch && matchKategori && matchRisiko;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Informasi Hama" />

            <main className="flex-1 p-8 bg-[#F4F5F7] min-h-screen">
                <div className="max-w-6xl mx-auto">

                    <h1 className="text-2xl font-bold mb-2">Informasi Hama</h1>
                    <p className="text-gray-600 mb-8 mt-2">
                        Telusuri berbagai jenis hama tanaman beserta gejala, pengobatan, dan cara pencegahannya.
                    </p>

                    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <SearchBar value={search} onChange={setSearch} />

                            <FilterDropdown
                                options={["Semua Kategori", "Serangga", "Ulat", "Tungau", "Belalang"]}
                                value={kategori}
                                onChange={setKategori}
                            />

                            <FilterDropdown
                                options={["Semua Risiko", "Rendah", "Sedang", "Berat"]}
                                value={risiko}
                                onChange={setRisiko}
                            />
                        </div>

                        <PestList pests={filteredPests} />
                    </div>
                </div>
            </main>
        </AppLayout>
    );
}
