import React from 'react';
import {Eye} from 'lucide-react';

interface Pest {
    id: number;
    nama: string;
    namaIlmiah: string;
    kategori: string;
    risiko: string;
    gambar: string;
    tanaman: string[];
}

const PestCard: React.FC<{pest:Pest}> = ({pest}) => {
    return (
        <div className="border rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
            <img src="{pest.gambar}" alt="{pest.nama}" className="w-full h-48 object-cover"/>
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        {pest.kategori}
                    </span>
                    <span className="bg-rose-100 text-rose-700 text-xs px-2 py-1 rounded-full">
                        Risiko: {pest.risiko}
                    </span>
                </div>
                <h3 className="text-lg font-semibold">
                    {pest.nama}
                </h3>
                <p className="italic text-gray-600 text-sm">
                    {pest.namaIlmiah}
                </p>
                <div className="mt-2 text-sm">
                    <p className="text-gray-600 mb-1">
                        Tanaman yang diserang:
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {pest.tanaman.map((item) => (
                            <span
                                key={item}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
                <button className="mt-3 w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white rounded-lg py-2 text-sm">
                    <Eye />
                    Lihat Detail
                </button>
            </div>
        </div>
    )
}

export default PestCard;
