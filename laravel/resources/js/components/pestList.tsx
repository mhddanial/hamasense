import React from 'react';
import PestCard from './pestCard';

export interface PestListProps {
    pests: {
        id: number;
        nama: string;
        namaIlmiah: string;
        kategori: string;
        risiko: string;
        gambar: string;
        tanaman: string[];
    }[];
}

const PestList: React.FC<PestListProps> = ({ pests }) => {
    if (!pests || pests.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Tidak ada data hama yang ditemukan</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pests.map((pest) => (
                <PestCard key={pest.id} pest={pest} />
            ))}
        </div>
    );
};

export default PestList;
