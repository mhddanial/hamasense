<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class DetectController extends Controller
{
    public function index()
    {
        return Inertia::render('detect/index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:10240', // 10MB
        ]);

        try {
            $image = $request->file('image');
            $filename = $image->getClientOriginalName() ?: 'image.jpg';

            // --- KIRIM KE FASTAPI ---
            $response = Http::attach(
                'file',
                file_get_contents($image->getRealPath()),
                $filename
            )->post('http://127.0.0.1:8080/predict');

            // Jika service AI gagal / timeout
            if ($response->failed()) {
                \Log::error('AI Service Error: ' . $response->body());
                return back()->withErrors([
                    'api' => 'Server AI tidak dapat dihubungi. Coba lagi.'
                ]);
            }

            $result = $response->json();

            // Jika API tidak mengembalikan struktur yang diharapkan
            if (!is_array($result) || !array_key_exists('should_abstain', $result)) {
                return Inertia::render('detect/result', [
                    'error' => 'Hasil prediksi tidak valid atau rusak.',
                    'image_url' => null,
                    'result' => null
                ]);
            }

            // --- AMBIL DATA ABSTAIN / PREDIKSI ---
            $shouldAbstain     = $result['should_abstain'] ?? true;
            $confidence        = $result['confidence'] ?? null;
            $predictedLabel    = $result['predicted_label'] ?? null;
            $entropy           = $result['entropy'] ?? null;
            $abstainReasons    = $result['abstain_reasons'] ?? [];
            $geminiInfo        = $result['info'] ?? null;

            // --- KASUS ABSTAIN / GAMBAR ANEH / CONFIDENCE RENDAH ---
            if ($shouldAbstain || $predictedLabel === null || $confidence === null) {
                return Inertia::render('detect/result', [
                    'error' => 'Gambar tidak dapat dikenali dengan cukup akurat.',
                    'abstain_reasons' => $abstainReasons,
                    'entropy' => $entropy,
                    'confidence' => $confidence,
                    'result' => null,
                    'image_url' => $this->encodeImage($image)
                ]);
            }

            // --- PREDIKSI VALID ---
            return Inertia::render('detect/result', [
                'result' => [
                    'label'        => $predictedLabel,
                    'confidence'   => $confidence,
                    'entropy'      => $entropy,
                    'info'  => $geminiInfo,
                ],
                'error' => null,
                'abstain_reasons' => $abstainReasons,
                'image_url' => $this->encodeImage($image)
            ]);

        } catch (\Exception $e) {
            \Log::error('System Error: ' . $e->getMessage());
            return back()->withErrors([
                'system' => 'Terjadi kesalahan pada sistem server.'
            ]);
        }
    }

    public function listHistory()
    {
        return Inertia::render('detect/history');
    }

    /**
        * Utility Encode Gambar jadi Base64
     */
    private function encodeImage($image)
    {
        $imageData = base64_encode(file_get_contents($image->getRealPath()));
        return 'data:' . $image->getMimeType() . ';base64,' . $imageData;
    }
}
