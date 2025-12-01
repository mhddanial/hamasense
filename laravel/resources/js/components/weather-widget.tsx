import { router } from "@inertiajs/react";
import { 
    CloudRain, Droplets, Wind, MapPin, 
    AlertTriangle, RefreshCw, Bug, Navigation 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { route } from "ziggy-js";

type WeatherData = {
    temp: number;
    humidity: number;
    wind_speed: number;
    description: string;
    city: string;
    icon_url: string;
    risk_level: "low" | "medium" | "high";
    risk_message: string;
    recommendation: string;
    last_updated: string;
};

export default function WeatherWidget({ weather }: { weather: WeatherData | null }) {
    const [isLoading, setIsLoading] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    // Fungsi Refresh Data (Menggunakan Lokasi Saat Ini di Session)
    const handleRefresh = () => {
        setIsLoading(true);
        router.post(route('weather.update-location'), {}, {
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Fungsi Update Lokasi via GPS Browser
    const getPreciseLocation = () => {
        if (!navigator.geolocation) {
            alert("Browser Anda tidak mendukung Geolocation.");
            return;
        }

        setGettingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // --- DEBUGGING START ---
                // Menampilkan data mentah dari GPS Browser untuk verifikasi
                const { latitude, longitude, accuracy } = position.coords;
                console.log("📍 GPS Raw Data:", position); 
                alert(`✅ GPS Berhasil Didapat!\n\nLatitude: ${latitude}\nLongitude: ${longitude}\nAkurasi: +/- ${Math.round(accuracy)} meter\n\nData ini akan dikirim ke server untuk cuaca presisi.`);
                // --- DEBUGGING END ---

                // SUKSES: Kirim Lat/Lon presisi ke Backend
                router.post(route('weather.update-location'), {
                    lat: latitude,
                    lon: longitude
                }, {
                    preserveScroll: true,
                    onFinish: () => setGettingLocation(false)
                });
            },
            (error) => {
                // GAGAL
                console.error("Gagal ambil lokasi GPS:", error);
                setGettingLocation(false);
                
                let errorMessage = "Gagal mendeteksi lokasi.";
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Izin lokasi ditolak. Mohon aktifkan izin lokasi di browser.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Informasi lokasi tidak tersedia.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Waktu permintaan lokasi habis.";
                        break;
                }
                alert(errorMessage);
            },
            {
                enableHighAccuracy: true, // Meminta mode GPS akurasi tinggi
                timeout: 5000,
                maximumAge: 0
            }
        );
    };

    // Tampilan Saat Data Kosong / Error
    if (!weather) {
        return (
            <Card className="border-dashed bg-slate-50 border-slate-200">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <CloudRain className="h-12 w-12 text-slate-300 mb-3" />
                    <p className="text-sm font-medium text-slate-500">Data cuaca tidak tersedia.</p>
                    <div className="flex gap-2 mt-4">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleRefresh} 
                            disabled={isLoading}
                            className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 gap-2"
                        >
                            <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                            Muat Ulang
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Styling Warna Berdasarkan Risiko
    const riskStyles = {
        low: "bg-emerald-50 text-emerald-800 border-emerald-200",
        medium: "bg-amber-50 text-amber-800 border-amber-200",
        high: "bg-rose-50 text-rose-800 border-rose-200",
    };

    const riskIconColors = {
        low: "text-emerald-600 bg-emerald-100/50 border-emerald-200",
        medium: "text-amber-600 bg-amber-100/50 border-amber-200",
        high: "text-rose-600 bg-rose-100/50 border-rose-200",
    };

    return (
        <div className="grid gap-4 md:grid-cols-12">
            
            {/* KIRI: Widget Utama Cuaca (4 Kolom) */}
            <Card className="md:col-span-4 bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 shadow-sm relative overflow-hidden group">
                {/* Efek Glow Background */}
                <div className="absolute top-0 right-0 -mr-6 -mt-6 h-32 w-32 rounded-full bg-emerald-100/40 blur-3xl transition-all group-hover:bg-emerald-200/40" />
                
                <CardContent className="flex flex-col justify-between relative z-10">
                    
                    {/* Header: Lokasi & Tombol GPS */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-emerald-800 text-sm font-bold">
                                <MapPin className="h-4 w-4 text-emerald-600" />
                                {weather.city}
                            </div>
                            
                            {/* Tombol Gunakan GPS (Ditambahkan Disini) */}
                            <button 
                                onClick={getPreciseLocation}
                                disabled={gettingLocation}
                                className="flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-emerald-600 transition-colors w-fit"
                                title="Gunakan lokasi GPS akurat dari browser"
                            >
                                <Navigation className={cn("h-3 w-3", gettingLocation && "animate-pulse text-emerald-600")} />
                                {gettingLocation ? "Mencari lokasi..." : "Gunakan Lokasi Saat Ini"}
                            </button>
                        </div>

                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-100/50"
                            onClick={handleRefresh}
                            disabled={isLoading}
                            title="Refresh Data"
                        >
                            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                        </Button>
                    </div>

                    {/* Tampilan Suhu Besar */}
                    <div className="flex items-center gap-4 mt-6">
                        <div className="relative">
                            {/* Glow di belakang icon */}
                            <div className="absolute inset-0 bg-yellow-200/20 blur-xl rounded-full scale-150"></div>
                            <img 
                                src={weather.icon_url} 
                                alt={weather.description} 
                                className="h-20 w-20 drop-shadow-sm relative z-10 scale-110"
                            />
                        </div>
                        <div>
                            <div className="flex items-start leading-none">
                                <span className="text-6xl font-extrabold tracking-tighter text-slate-800">
                                    {Math.round(weather.temp)}
                                </span>
                                <span className="text-3xl font-medium text-slate-400 mt-1 ml-1">°C</span>
                            </div>
                            <div className="text-sm font-semibold text-slate-500 capitalize mt-2 pl-1">
                                {weather.description}
                            </div>
                        </div>
                    </div>
                    
                    {/* Detail Grid (Kelembaban & Angin) */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 bg-white/60 p-2.5 rounded-xl border border-slate-100 shadow-sm backdrop-blur-sm">
                            <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg">
                                <Droplets className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kelembaban</p>
                                <p className="text-sm font-bold text-slate-700">{weather.humidity}%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/60 p-2.5 rounded-xl border border-slate-100 shadow-sm backdrop-blur-sm">
                            <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
                                <Wind className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Angin</p>
                                <p className="text-sm font-bold text-slate-700">{weather.wind_speed} <span className="text-[10px] font-normal">km/j</span></p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KANAN: Analisa Risiko & Rekomendasi (8 Kolom) */}
            <div className="md:col-span-8 gap-4 space-y-3">
                
                {/* Alert Status Risiko */}
                <Alert className={cn("flex-1 flex flex-col justify-center border shadow-sm", riskStyles[weather.risk_level])}>
                    <div className="flex gap-5 items-start px-2">
                        <div className={cn("p-3 rounded-full border shadow-sm", riskIconColors[weather.risk_level])}>
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <div className="space-y-1 pt-1">
                            <AlertTitle className="font-bold flex items-center gap-2 text-lg">
                                Kemungkinan Hama: {weather.risk_level === 'high' ? 'RISIKO TINGGI' : weather.risk_level === 'medium' ? 'WASPADA' : 'AMAN'}
                            </AlertTitle>
                            <AlertDescription className="text-sm leading-relaxed font-medium opacity-90 max-w-2xl">
                                {weather.risk_message}
                            </AlertDescription>
                        </div>
                    </div>
                </Alert>

                {/* Card Rekomendasi AI */}
                <Card className="bg-white border border-slate-200 shadow-sm">
                    <CardContent className="flex gap-4 items-start">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shrink-0">
                            <Bug className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-2 p-3">
                            <h4 className="text-sm font-bold text-slate-800">
                                Rekomendasi Tindakan
                            </h4>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {weather.recommendation}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}