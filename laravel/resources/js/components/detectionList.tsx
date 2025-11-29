import React from 'react';
import DetectionCard from '@/components/detectionCard';
import {detect} from '../types/detect';

interface PestListProps {
    detects: detect[];
}

const DetectionList: React.FC<PestListProps> = ({detects}) => {
    if (detects.length == 0)
        return <p className="text-gray-500">Tidak ada data riwayat deteksi</p>

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {detects.map((detect, index) => (
                <DetectionCard key={detect.id} detect={detect} index={index}/>
            ))}
        </div>
    )
}

export default DetectionList;
