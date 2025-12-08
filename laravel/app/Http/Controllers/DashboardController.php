<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Stevebauman\Location\Facades\Location;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Menampilkan halaman dashboard utama.
     */
    public function index(Request $request)
    {
        // 1. Cek apakah data cuaca sudah ada di session user?
        // Ini mencegah request API berulang-ulang setiap kali user refresh halaman (F5)
        if ($request->session()->has('weather_data')) {
            $weatherData = $request->session()->get('weather_data');
        } else {
            // 2. Jika tidak ada di session, ambil data baru dari API
            $weatherData = $this->fetchWeatherByUserIP($request);
            
            // Simpan ke session (berlaku selama user login/browsing)
            // Jika $weatherData null (gagal), jangan simpan ke session agar dicoba lagi nanti
            if ($weatherData) {
                $request->session()->put('weather_data', $weatherData);
            }
        }

        return Inertia::render('dashboard', [
            'user' => Auth::user(),
            'weather' => $weatherData, 
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Endpoint untuk memaksa refresh data cuaca (via tombol di frontend).
     */
    public function refreshWeather(Request $request)
    {
        // Hapus data lama dari session
        $request->session()->forget('weather_data');

        // Redirect kembali, otomatis logic di index() akan mengambil data baru
        return back()->with('success', 'Data cuaca berhasil diperbarui.');
    }

    public function updateWeatherByGPS(Request $request)
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
        ]);

        $apiKey = config('services.openweather.key'); // Pastikan pakai config
        
        // Fetch langsung pakai koordinat dari React
        $response = Http::timeout(5)->get("https://api.openweathermap.org/data/2.5/weather", [
            'lat' => $request->lat,
            'lon' => $request->lon,
            'appid' => $apiKey,
            'units' => 'metric',
            'lang' => 'id'
        ]);

        if ($response->successful()) {
            // Proses data & Update Session
            $data = $response->json();
            
            // Nama kota dari GPS biasanya lebih akurat (nama kecamatan/desa)
            $cityName = $data['name']; 
            
            $weatherData = $this->analyzePestRisk($data, $cityName);
            
            // Update Session dengan data baru yang presisi
            $request->session()->put('weather_data', $weatherData);
            
            return back()->with('success', "Lokasi diperbarui ke: $cityName");
        }

        return back()->with('error', 'Gagal memperbarui cuaca dari GPS.');
    }

    /**
     * Private: Logika inti pengambilan data lokasi dan cuaca.
     */
    private function fetchWeatherByUserIP(Request $request)
    {
    $ip = $request->ip();
        if (in_array($ip, ['127.0.0.1', '::1'])) $ip = '114.125.35.77';

        $position = Location::get($ip);
        $lat = $position ? $position->latitude : 1.083333;
        $lon = $position ? $position->longitude : 104.033333;
        $cityName = $position ? $position->cityName : 'Lokasi Terdeteksi';

        $apiKey = config('services.openweather.key');

        try {
            $response = Http::timeout(10)->get("https://api.openweathermap.org/data/2.5/weather", [
                'lat' => $lat,
                'lon' => $lon,
                'appid' => $apiKey,
                'units' => 'metric',
                'lang' => 'id'
            ]);

            // Jika GAGAL, tampilkan error API-nya di layar
            if ($response->failed()) {
                dd("API Error:", $response->json(), "URL:", "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$apiKey");
            }
            
            return $this->analyzePestRisk($response->json(), $cityName);

        } catch (\Exception $e) {            
            dd("Koneksi Error:", $e->getMessage());
        }
        return null; 
    }

    /**
     * Private: Menganalisis risiko hama berdasarkan parameter cuaca.
     */
    private function analyzePestRisk($data, $fallbackCityName)
    {
        $temp = $data['main']['temp'];
        $humidity = $data['main']['humidity'];
        $windSpeed = $data['wind']['speed'] * 3.6; // Konversi m/s ke km/jam

        // --- ALGORITMA DETEKSI RISIKO HAMA (DSS) ---
        
        $riskLevel = 'low';
        $riskMessage = 'Kondisi lingkungan cukup aman. Lakukan pemantauan rutin.';
        $recommendation = 'Pertahankan kebersihan area tanam.';

        // Aturan 1: Kelembaban Tinggi (Pemicu Jamur/Fungi)
        if ($humidity >= 85) {
            $riskLevel = 'high';
            $riskMessage = 'Kelembaban ekstrem! Risiko sangat tinggi serangan jamur dan busuk akar.';
            $recommendation = 'Kurangi penyiraman, perbaiki sirkulasi udara, dan cek drainase segera.';
        } 
        // Aturan 2: Suhu Panas + Kering (Pemicu Kutu/Thrips/Mites)
        elseif ($temp >= 32 && $humidity < 60) {
            $riskLevel = 'high';
            $riskMessage = 'Suhu panas kering. Waspada ledakan populasi Thrips dan Tungau.';
            $recommendation = 'Lakukan penyiraman misting (kabut) untuk menaikkan kelembaban mikro.';
        }
        // Aturan 3: Kelembaban Sedang-Tinggi (Waspada Umum)
        elseif ($humidity >= 75) {
            $riskLevel = 'medium';
            $riskMessage = 'Kelembaban meningkat. Potensi awal pertumbuhan bakteri.';
            $recommendation = 'Siapkan fungisida nabati sebagai pencegahan.';
        }
        // Aturan 4: Angin Kencang (Penyebaran Spora)
        elseif ($windSpeed > 20) {
            $riskLevel = 'medium';
            $riskMessage = 'Angin kencang mempercepat penyebaran spora antar tanaman.';
            $recommendation = 'Cek tanaman pelindung (barrier) di sekitar lahan.';
        }

        return [
            'temp' => round($temp, 1),
            'humidity' => $humidity,
            'wind_speed' => round($windSpeed, 1),
            'description' => ucfirst($data['weather'][0]['description']),
            'city' => $data['name'] ?: $fallbackCityName, // Gunakan nama dari API jika ada
            'icon_url' => "https://openweathermap.org/img/wn/{$data['weather'][0]['icon']}@2x.png",
            'risk_level' => $riskLevel,    // 'low', 'medium', 'high'
            'risk_message' => $riskMessage,
            'recommendation' => $recommendation,
            'last_updated' => now()->format('H:i'),
        ];
    }
}
