import React from 'react';
import {CoffeeIcon, Eye} from 'lucide-react';
import { Card, CardTitle, CardHeader, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
    const getRiskColor =  (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'berat' :
                return 'bg-red-100 text-red-700';
            case 'sedang':
                return 'bg-orange-100 text-orange-700';
            case 'ringan':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    }
    return (
        <Card className="border rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden p-0 gap-0">
            <img
                src="{pest.gambar}"
                alt="{pest.nama}"
                className="w-full h-48 object-cover"
                onError={(e: any) => {
                    e.target.onError = null;
                    e.target.src="";
                }}
            />
            <CardContent className="flex flex-col gap-3 p-4 pt-4 pb-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        {pest.kategori}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskColor(pest.risiko)}`}>
                        Risiko: {pest.risiko}
                    </span>
                </div>
                <div>
                    <CardTitle className="text-lg font-semibold mb-0 leading-tight">
                        {pest.nama}
                    </CardTitle>
                    <CardDescription className="italic text-gray-600 text-sm mt-0">
                        {pest.namaIlmiah}
                    </CardDescription>
                </div>
                <div className="mt-1 text-sm">
                    <p className="text-gray-600 mb-2">
                        Tanaman yang diserang:
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {pest.tanaman.map((item) => (
                            <span
                                key={item}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="px-4 pb-4 pt-3 mt-auto">
                <Button className="mt-3 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/80 text-white rounded-lg py-2 text-sm">
                    <Eye />
                    Lihat Detail
                </Button>
            </CardFooter>
        </Card>
    )
}

export default PestCard;
