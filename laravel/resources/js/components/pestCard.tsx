import React from "react";
import { Eye } from "lucide-react";
import { Card, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { pest } from "@/types/pest";

const PestCard: React.FC<{ pest: pest }> = ({ pest }) => {
    const getRiskColor = (r: string) => {
        switch (r.toLowerCase()) {
            case "berat":
                return "bg-red-100 text-red-700";
            case "sedang":
                return "bg-orange-100 text-orange-700";
            case "ringan":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <Card className="rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
            <img
                src={pest.gambar}
                alt={pest.nama}
                className="w-full h-48 object-cover"
                onError={(e) => (e.currentTarget.src = "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=")}
            />

            <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                    <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-md">
                        {pest.kategori}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-md ${getRiskColor(pest.risiko)}`}>
                        Risiko: {pest.risiko}
                    </span>
                </div>

                <CardTitle className="text-lg font-semibold">{pest.nama}</CardTitle>
                <CardDescription className="italic text-gray-600 text-sm">{pest.namaIlmiah}</CardDescription>

                <p className="text-sm text-gray-600 mt-3 mb-1">Tanaman yang diserang:</p>
                <div className="flex flex-wrap gap-1">
                    {pest.tanaman.map((t) => (
                        <span key={t} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                            {t}
                        </span>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button className="w-full flex items-center justify-center gap-2">
                    <Eye size={16} /> Lihat Detail
                </Button>
            </CardFooter>
        </Card>
    );
};

export default PestCard;
