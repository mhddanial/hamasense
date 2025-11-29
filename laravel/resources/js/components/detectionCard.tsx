import React from 'react';
import {EllipsisVertical} from 'lucide-react'

interface DetectionHistory {
    id: number;
    tanaman: string;
    namaPenyakit: string;
    kategori: string
    risiko: string;
    gambar: string;
}

type DetectionCardProps = {
    detect: DetectionHistory;
    index: number;
}

const DetectionCard: React.FC<DetectionCardProps> = ({detect, index}) => {
    return (
        <div className="border rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden">
            <img src={detect.gambar} alt={detect.tanaman} className="w-full h-48 object-cover"/>
            <div className="p-4">
                <h3 className="text-lg font-semibold">
                    {detect.tanaman}
                </h3>
                <p className="text-gray-600 text-sm mb-10">
                    {detect.namaPenyakit}
                </p>
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-700 font-medium">
                        Hari ke - {index + 1}
                    </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                    <span
                        className={`text-xs px-2 py-1 rounded-full ${
                            detect.kategori === "Sakit"
                            ? "bg-[#FDF682] text-black"
                            : detect.kategori === "Dalam Perawatan"
                            ? "bg-[#BFDBFE] text-black"
                            : detect.kategori === "Terserang Hama"
                            ? "bg-[#FECACA] text-black"
                            : "bg-[#BBF7D0] text-black"
                        }`}>
                        {detect.kategori}
                    </span>
                    <EllipsisVertical />
                </div>
            </div>
        </div>
    )
}

export default DetectionCard;
