import React from 'react';
import PestCard from './pestCard';
import { pest as PestType } from '../types/pest';

interface PestListProps {
    pests: PestType[];
}

// === DUMMY DATA ===
const DUMMY_PESTS: PestType[] = [
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

const PestList: React.FC<PestListProps> = ({ pests }) => {
    // Gunakan dummy jika pests kosong
    const dataToRender = pests.length > 0 ? pests : DUMMY_PESTS;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataToRender.map((pest) => (
                <PestCard key={pest.id} pest={pest} />
            ))}
        </div>
    );
};

export default PestList;
