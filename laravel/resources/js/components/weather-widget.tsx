import { router } from "@inertiajs/react";
import {
    CloudRain, Droplets, Wind, MapPin,
    AlertTriangle, RefreshCw, HandHeart, Navigation
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
                const { latitude, longitude } = position.coords;

                // Kirim Lat/Lon presisi ke Backend
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
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Izin lokasi ditolak. Mohon aktifkan izin lokasi di browser.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Informasi lokasi tidak tersedia.";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "Gagal memuat cuaca.";
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
                    <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        Izinkan akses lokasi untuk menampilkan informasi cuaca dan risiko hama di area Anda.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button
                            variant="default"
                            size="sm"
                            onClick={getPreciseLocation}
                            disabled={gettingLocation || isLoading}
                            className="bg-primary hover:bg-primary/80 hover:cursor-pointer text-white gap-2"
                        >
                            <Navigation className={cn("h-3.5 w-3.5", gettingLocation && "animate-pulse")} />
                            {gettingLocation ? "Mencari lokasi..." : "Izinkan Lokasi"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={isLoading || gettingLocation}
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

                <div className="absolute top-0 right-0 -mr-6 -mt-6 h-32 w-32 rounded-full bg-emerald-100/40 blur-3xl transition-all group-hover:bg-emerald-200/40" />

                <CardContent className="flex flex-col justify-between relative z-10">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-emerald-800 text-sm font-bold">
                                <MapPin className="h-4 w-4 text-emerald-600" />
                                {weather.city}
                            </div>
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

                    {/* Grid Detail (desktop only label) */}
                    <div className="mt-2 grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 bg-white/60 p-2.5 rounded-xl border border-slate-100 shadow-sm backdrop-blur-sm">
                            <div className="p-1.5 bg-blue-50 text-blue-500 rounded-lg">
                                <Droplets className="h-4 w-4" />
                            </div>

                            {/* LABEL + VALUE */}
                            <div>
                                <p className="hidden md:block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    KELEMBABAN
                                </p>
                                <p className="text-sm font-bold text-slate-700">{weather.humidity}%</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white/60 p-2.5 rounded-xl border border-slate-100 shadow-sm backdrop-blur-sm">
                            <div className="p-1.5 bg-slate-100 text-slate-500 rounded-lg">
                                <Wind className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="hidden md:block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    ANGIN
                                </p>
                                <p className="text-sm font-bold text-slate-700">
                                    {weather.wind_speed} <span className="text-[10px] font-normal">km/j</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KANAN: Analisa Risiko & Rekomendasi */}
            <div className="md:col-span-8 space-y-4">
                {/* Alert Status Risiko */}
                <Alert
                    className={cn(
                        "flex items-start md:flex-row gap-3 rounded-xl border shadow-sm transition-all",
                        riskStyles[weather.risk_level]
                    )}
                >
                    <div
                        className={cn(
                            "flex p-2 items-center justify-center rounded-full shrink-0",
                            riskIconColors[weather.risk_level]
                        )}
                    >
                        <AlertTriangle className="h-5 w-5 md:h-6 md:w-6" />
                    </div>

                    <div className="space-y-1">
                        <AlertTitle className="font-bold text-base md:text-lg">
                            Tingkat Risiko:
                            <span className="ml-1">
                                {weather.risk_level === "high"
                                    ? "RISIKO TINGGI"
                                    : weather.risk_level === "medium"
                                        ? "WASPADA"
                                        : "AMAN"}
                            </span>
                        </AlertTitle>

                        <AlertDescription className="text-xs text-slate-700 leading-relaxed">
                            {weather.risk_message}
                        </AlertDescription>
                    </div>
                </Alert>

                {/* Card Rekomendasi */}
                <Card className="bg-white border border-slate-200 shadow-sm rounded-xl">
                    <CardContent className="flex gap-3 items-start p-4">

                        {/* Icon */}
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shrink-0">
                            <HandHeart className="h-5 w-5 md:h-6 md:w-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-base md:text-lg">
                                Rekomendasi Tindakan
                            </h4>

                            <p className="text-xs text-slate-600 leading-relaxed">
                                {weather.recommendation}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}