import {
    Thermometer,
    Droplets,
    Wind,
    CloudHail,
    Cloud
} from "lucide-react";

export function WeatherAlertCard() {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-yellow-400 rounded-xl p-4 mb-6 text-black">
            <div className="flex items-center gap-3">
                <CloudHail size={40} />
                <div>
                    <h2 className="font-semibold">
                        Peringatan Cuaca - Risiko Hama Tinggi
                    </h2>
                    <p className="text-sm">
                        Kelembaban tinggi di Kota Batam meningkatkan risiko serangan jamur dan kutu daun.
                        Lakukan pemantuan ekstra pada tanaman anda.
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                        <Thermometer size={16} /><span>32°C</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Droplets size={16} /><span>85%</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Wind size={16} /><span>12km/h</span>
                    </div>
                </div>
            </div>
        </div>
    );
}