import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/filterDropdown";
import PestList from "@/components/pestList";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from "@/types";
import { Pest } from "@/types/admin";

// ✅ DATA DUMMY (sesuai field yang dipakai di component ini)
const dummyPests: Pest[] = [
  {
    id: 1,
    name: "Ulat Grayak",
    scientific_name: "Spodoptera frugiperda",
    category: "Serangga",
    risk_level: "Berat",
    image_path: null as any, // kalau type kamu tidak menerima null, ganti jadi undefined
    plant_types: [{ name: "Jagung" }, { name: "Padi" }] as any,
  } as Pest,
  {
    id: 2,
    name: "Kutu Daun",
    scientific_name: "Aphis gossypii",
    category: "Serangga",
    risk_level: "Sedang",
    image_path: "pests/aphids.jpg" as any,
    plant_types: [{ name: "Cabai" }, { name: "Terong" }] as any,
  } as Pest,
  {
    id: 3,
    name: "Embun Tepung",
    scientific_name: "Erysiphe spp.",
    category: "Jamur",
    risk_level: "Sedang",
    image_path: "pests/powdery-mildew.jpg" as any,
    plant_types: [{ name: "Mentimun" }, { name: "Melon" }] as any,
  } as Pest,
  {
    id: 4,
    name: "Layu Bakteri",
    scientific_name: "Ralstonia solanacearum",
    category: "Bakteri",
    risk_level: "Berat",
    image_path: "pests/bacterial-wilt.jpg" as any,
    plant_types: [{ name: "Tomat" }, { name: "Kentang" }] as any,
  } as Pest,
  {
    id: 5,
    name: "Mosaik Kuning",
    scientific_name: "Begomovirus",
    category: "Virus",
    risk_level: "Rendah",
    image_path: null as any,
    plant_types: [{ name: "Cabai" }] as any,
  } as Pest,
];

interface Props {
  pests: Pest[];
}

export default function PestInfo({ pests }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Info Hama", href: route("pest.user.index") },
  ];

  // ✅ pakai dummy kalau data dari server kosong
  const pestsData = pests?.length ? pests : dummyPests;

  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua Kategori");
  const [risiko, setRisiko] = useState("Semua Risiko");

  const filteredPests = pestsData.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.scientific_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.plant_types &&
        p.plant_types.some((pt: any) =>
          pt.name.toLowerCase().includes(search.toLowerCase())
        ));

    const matchKategori = kategori === "Semua Kategori" || p.category === kategori;
    const matchRisiko = risiko === "Semua Risiko" || p.risk_level === risiko;

    return matchSearch && matchKategori && matchRisiko;
  });

  const mappedPests = filteredPests.map((p) => ({
    id: p.id,
    nama: p.name,
    namaIlmiah: p.scientific_name,
    kategori: p.category,
    risiko: p.risk_level,
    gambar: p.image_path
      ? `/storage/${p.image_path}`
      : "https://placehold.co/800x600?text=No+Image",
    tanaman: p.plant_types ? p.plant_types.map((pt: any) => pt.name) : [],
  }));

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
                options={["Semua Kategori", "Serangga", "Jamur", "Bakteri", "Virus"]}
                value={kategori}
                onChange={setKategori}
              />
              <FilterDropdown
                options={["Semua Risiko", "Rendah", "Sedang", "Berat"]}
                value={risiko}
                onChange={setRisiko}
              />
            </div>

            <PestList pests={mappedPests} />
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
