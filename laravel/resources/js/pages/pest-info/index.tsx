import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from "@/types";
import { Pest } from "@/types/admin";
import { 
    Filter, 
    Sprout, 
    Bug, 
    AlertTriangle, 
    SearchX, 
    ArrowRight 
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

// ✅ DATA DUMMY
const dummyPests: Pest[] = [
  {
    id: 1,
    name: "Ulat Grayak",
    scientific_name: "Spodoptera frugiperda",
    category: "Serangga",
    risk_level: "Berat",
    image_path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPKUXRelYvTOphG_cftpYKXBo3qKYL9FQhKQ&s',
    plant_types: [{ name: "Jagung" }, { name: "Padi" }],
  } as unknown as Pest,
  {
    id: 2,
    name: "Kutu Daun",
    scientific_name: "Aphis gossypii",
    category: "Serangga",
    risk_level: "Sedang",
    image_path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEk_Q7Li3HwiRF8iIWF3WKRUWAPo1Wa_YbJg&s',
    plant_types: [{ name: "Cabai" }, { name: "Terong" }],
  } as unknown as Pest,
  {
    id: 3,
    name: "Embun Tepung",
    scientific_name: "Erysiphe spp.",
    category: "Jamur",
    risk_level: "Sedang",
    image_path: 'https://asset.kompas.com/crops/LSdhT-yT4K73DLEDR_0GyMdRWLA=/193x128:1727x1151/1200x800/data/photo/2021/04/04/60695dc2cee05.jpg',
    plant_types: [{ name: "Mentimun" }, { name: "Melon" }],
  } as unknown as Pest,
  {
    id: 4,
    name: "Spider Mite",
    scientific_name: "Tetranychus urticae",
    category: "Serangga",
    risk_level: "Berat",
    image_path: 'https://cdn.shopify.com/s/files/1/0442/8929/4491/files/Red_Spider_Mite_1_CANVA25.jpg?v=1755692684',
    plant_types: [{ name: "Tomat" }, { name: "Kentang" }],
  } as unknown as Pest,
];

interface Props {
  pests: Pest[];
}

export default function PestInfo({ pests }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Info Hama", href: route("pest.user.index") },
  ];

  // Gunakan data dummy jika props kosong
  const pestsData = pests?.length ? pests : dummyPests;

  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua Kategori");
  const [risiko, setRisiko] = useState("Semua Risiko");

  // Logic Filtering
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

  // Helper untuk warna badge risiko
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
        case 'berat': return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200";
        case 'sedang': return "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200";
        case 'rendah': return "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200";
        default: return "bg-gray-100 text-gray-700 border-gray-200";
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
                            <Filter className="h-4 w-4" />
                            <SelectValue placeholder="Kategori" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Semua Kategori">Semua Kategori</SelectItem>
                        <SelectItem value="Serangga">Serangga</SelectItem>
                        <SelectItem value="Jamur">Jamur</SelectItem>
                        <SelectItem value="Bakteri">Bakteri</SelectItem>
                        <SelectItem value="Virus">Virus</SelectItem>
                    </SelectContent>
                </Select>

                {/* Filter Risiko */}
                <Select value={risiko} onValueChange={setRisiko}>
                    <SelectTrigger className="w-full sm:w-[200px] bg-white">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertTriangle className="h-4 w-4" />
                            <SelectValue placeholder="Risiko" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Semua Risiko">Semua Risiko</SelectItem>
                        <SelectItem value="Rendah">Rendah</SelectItem>
                        <SelectItem value="Sedang">Sedang</SelectItem>
                        <SelectItem value="Berat">Berat</SelectItem>
                    </SelectContent>
                </Select>

            </div>
        </div>

        {/* --- PEST GRID LIST --- */}
        <div className="relative flex-1 min-h-[50vh]">
            {filteredPests.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredPests.map((pest) => (
                        <Link 
                            key={pest.id} 
                            href={route('pest.user.show', pest.id)}
                            className="group flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 h-full"
                        >
                            {/* Image Wrapper */}
                            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                {pest.image_path ? (
                                    <img
                                        src={`${pest.image_path}`}
                                        alt={pest.name}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                        <Bug className="h-12 w-12 opacity-20" />
                                    </div>
                                )}
                                
                                {/* Category Badge (Overlay) */}
                                <div className="absolute top-2 left-2">
                                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm text-xs font-medium text-black border-0">
                                        {pest.category}
                                    </Badge>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-5 space-y-3">
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                                            {pest.name}
                                        </h3>
                                    </div>
                                    <p className="text-sm italic text-muted-foreground">
                                        {pest.scientific_name}
                                    </p>
                                </div>

                                {/* Plant Types */}
                                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                    <Sprout className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                    <span className="line-clamp-1">
                                        {pest.plant_types && pest.plant_types.length > 0 
                                            ? pest.plant_types.map((p: any) => p.name).join(", ") 
                                            : "Umum"}
                                    </span>
                                </div>

                                {/* Footer: Risk & Action */}
                                <div className="mt-auto pt-4 flex items-center justify-between border-t">
                                    <Badge variant="outline" className={`${getRiskColor(pest.risk_level)} border-0`}>
                                        {pest.risk_level}
                                    </Badge>
                                    
                                    <span className="inline-flex items-center justify-center rounded-full p-1 text-muted-foreground transition-colors group-hover:text-primary group-hover:bg-primary/10">
                                        <ArrowRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </div>
                        </Link>
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