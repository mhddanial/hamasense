import {useState} from 'react';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/filterDropdown';
import PestList from '@/components/pestList'
import {AppSidebar} from '@/components/app-sidebar';
import {SidebarProvider} from '@/components/ui/sidebar';

const InfoHama = () => {
    const [search, setSearch] = useState("");
    const [kategori, setKategori] = useState("Semua Kategori");
    const [risiko, setRisiko] = useState("Semua Risiko");

    const pests = [
        { 
            id: 1,
            nama: "Tungau Laba-laba",
            namaIlmiah: "Tetranychidae",
            kategori: "Tungau",
            risiko: "Sedang",
            gambar: "/images/tungau.jpg",
            tanaman: ["Tomat", "Paprika", "Cabai"],
        },
        {
            id: 2,
            nama: "Ulat Grayak",
            namaIlmiah: "Spodoptera litura",
            kategori: "Ulat",
            risiko: "Berat",
            gambar: "/images/ulat-grayak.jpg",
            tanaman: ["Padi", "Jagung", "Kedelai"],
        },
        {
            id: 3,
            nama: "Ulat - ulatan",
            namaIlmiah: "Spodoptera litura",
            kategori: "Ulat",
            risiko: "Berat",
            gambar: "/images/ulat.jpg",
            tanaman: ["Padi", "Jagung", "Kedelai"],
        },
        {
            id: 4,
            nama: "Cengcorang Usluk",
            namaIlmiah: "Cengcorangis ingis ingis",
            kategori: "Cencorang",
            risiko: "Berat",
            gambar: "/images/ulat-grayak.jpg",
            tanaman: ["Padi", "Jagung", "Kedelai"],
        },
    ];

    const filteredPests = pests.filter((p) => {
    const matchSearch =
        p.nama.toLowerCase().includes(search.toLowerCase()) ||
        p.namaIlmiah.toLowerCase().includes(search.toLowerCase()) ||
        p.tanaman.some((t) =>
            t.toLowerCase().includes(search.toLowerCase())
        );
        const matchKategori =
            kategori === "Semua Kategori" || p.kategori === kategori;
        const matchRisiko =
            risiko === "Semua Risiko" || p.risiko === risiko;
        return matchSearch && matchKategori && matchRisiko;
    });

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-[#F4F5F7]">
                <AppSidebar />

                <main className="flex-1 p-5 overflow-y-auto">
                    <div className="max-w-7xl mx-15 mt-15">
                        <h1 className="text-2xl font-bold">Informasi Hama</h1>
                        <p className="flex text-gray-600 mb-10">
                            Telusuri berbagai jenis hama tanaman beserta gejala, pengobatan, dan cara pencegahannya
                        </p>

                        <div className='p-8 rounded-lg bg-[#FFFFFF]'>
                            <div className="flex gap-4 mb-6">
                                <SearchBar value={search} onChange={setSearch} />
                                <FilterDropdown
                                    options={["Semua Kategori", "Serangga", "Ulat", "Tungau", "Cencorang"]}
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
            </div>
        </SidebarProvider>
    );
}

export default InfoHama;
