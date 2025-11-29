import {useState} from 'react';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/filterDropdown';
import DetectionList from '@/components/detectionList';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function RiwayatDeteksi() {
    const breadcrumbs : BreadcrumbItem[] = [
        {
            title: 'Riwayat Deteksi',
            href: route('detect.history'),
        },
    ]

    const [search, setSearch] = useState("");
    const [kategori, setKategori] = useState("Semua Kategori");
    const [risiko, setRisiko] = useState("Semua Risiko");

    const hasilDeteksi = [
        {
            id: 1,
            tanaman: "Tomat",
            namaPenyakit: "Bercak Daun Septoria",
            kategori: "Sakit",
            risiko: "Sedang",
            gambar: "/images/tungau.jpg",
        },
        { 
            id: 2,
            tanaman: "Tomat",
            namaPenyakit: "Bercak Daun Septoria",
            kategori: "Dalam Perawatan",
            risiko: "Sedang",
            gambar: "/images/tungau.jpg",
        },
        { 
            id: 3,
            tanaman: "Tomat",
            namaPenyakit: "Bercak Daun Septoria",
            kategori: "Terserang Hama",
            risiko: "Sedang",
            gambar: "/images/tungau.jpg",
        },
        { 
            id: 4,
            tanaman: "Tomat",
            namaPenyakit: "Bercak Daun Septoria",
            kategori: "Sehat",
            risiko: "Sedang",
            gambar: "/images/tungau.jpg",
        },
    ];

    const filteredDeteksi = hasilDeteksi.filter((p) => {
        const matchSearch =
            p.tanaman.toLowerCase().includes(search.toLowerCase()) ||
            p.namaPenyakit.toLowerCase().includes(search.toLowerCase())

        const matchKategori =
            kategori === "Semua Kategori" || p.kategori === kategori;

        const matchRisiko =
            risiko === "Semua Risiko" || p.risiko === risiko;

        return matchSearch && matchKategori && matchRisiko;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Deteksi"/>
            <div className="flex min-h-screen w-full bg-[#F4F5F7]">

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-2xl font-bold">Riwayat Detesi</h1>
                        <p className="flex text-gray-600 mb-10">
                            Temukan riwayat perawatan dari tanaman anda
                        </p>

                        <div className='p-8 rounded-lg bg-[#FFFFFF]'>
                            <div className="flex gap-4 mb-6">
                                <SearchBar value={search} onChange={setSearch} />
                                <FilterDropdown
                                    options={["Semua Kategori", "Serangga", "Ulat", "Tungau"]}
                                    value={kategori}
                                    onChange={setKategori}
                                />
                                <FilterDropdown
                                    options={["Semua Risiko", "Rendah", "Sedang", "Berat"]}
                                    value={risiko}
                                    onChange={setRisiko}
                                />
                            </div>

                            <DetectionList detects={filteredDeteksi} />
                        </div>
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
