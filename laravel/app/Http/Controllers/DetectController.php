<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Models\DetectionHistory;

class DetectController extends Controller
{
    public function index()
    {
        return Inertia::render('detect/index');
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        try {
            $image = $request->file('image');
            $hashedName = md5(uniqid() . time()) . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('detections', $hashedName, 'public');

            // Simpan path di session untuk dipakai saat klik "Simpan Riwayat"
            session(['uploaded_image_path' => $path]);

            $response = Http::timeout(120)->attach(
                'file',
                file_get_contents($image->getRealPath()),
                $hashedName
            )->post('http://127.0.0.1:8080/predict');

            if ($response->failed()) {
                \Log::error('AI Service Error: ' . $response->body());
                return back()->withErrors([
                    'api' => 'Server AI error: ' . $response->status() . ' - ' . $response->body()
                ]);
            }

            $result = $response->json();
            if (!is_array($result) || !array_key_exists('should_abstain', $result)) {
                return Inertia::render('detect/result', [
                    'error' => 'Hasil prediksi tidak valid atau rusak.',
                    'image_url' => null,
                    'result' => null
                ]);
            }

            $shouldAbstain     = $result['should_abstain'] ?? true;
            $confidence        = $result['confidence'] ?? null;
            $predictedLabel    = $result['predicted_label'] ?? null;
            $entropy           = $result['entropy'] ?? null;
            $abstainReasons    = $result['abstain_reasons'] ?? [];
            $geminiInfo        = $result['info'] ?? null;

            if ($shouldAbstain || $predictedLabel === null || $confidence === null) {
                return Inertia::render('detect/result', [
                    'error' => 'Gambar tidak dapat dikenali dengan cukup akurat.',
                    'abstain_reasons' => $abstainReasons,
                    'entropy' => $entropy,
                    'confidence' => $confidence,
                    'result' => null,
                    'image_url' => $this->encodeImage($image),
                    'image_path' => $path,
                ]);
            }
            return Inertia::render('detect/result', [
                'result' => [
                    'label'        => $predictedLabel,
                    'confidence'   => $confidence,
                    'entropy'      => $entropy,
                    'info'         => $geminiInfo,
                ],
                'error' => null,
                'abstain_reasons' => $abstainReasons,
                'image_url' => $this->encodeImage($image),
                'image_path' => $path,
            ]);


        } catch (\Exception $e) {
            \Log::error('System Error: ' . $e->getMessage());
            return back()->withErrors([
                'system' => 'Error: ' . $e->getMessage()
            ]);
        }
    }

    public function saveHistory(Request $request)
    {
        $path = session('uploaded_image_path');

        if (!$path) {
            return back()->withErrors(['system' => 'Gambar tidak ditemukan di sesi.']);
        }

        $request->validate([
            'label'           => 'nullable|string',
            'confidence'      => 'nullable|numeric',
            'entropy'         => 'nullable|numeric',
            'info'            => 'nullable',
            'abstain_reasons' => 'nullable',
            'should_abstain'  => 'boolean'
        ]);

        DetectionHistory::create([
            'user_id'         => auth()->id(),
            'image_path'      => $path,
            'label'           => $request->label,
            'confidence'      => $request->confidence,
            'entropy'         => $request->entropy,
            'info'            => $request->info,
            'abstain_reasons' => $request->abstain_reasons,
            'should_abstain'  => $request->should_abstain ?? false
        ]);

        session()->forget('uploaded_image_path');

        return redirect()->route('detect.history')->with('success', 'Riwayat deteksi berhasil disimpan!');
    }


    public function listHistory()
    {
        $history = DetectionHistory::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('detect/history-test', [
            'history' => $history,
        ]);
    }

    public function showHistory($id)
    {
        $history = DetectionHistory::where('user_id', auth()->id())
        ->findOrFail($id);
        return Inertia::render('detect/history-detail', [
            'item' => [
                'id'            => $history->id,
                'image_path'    => $history->image_path,
                'label'         => $history->label,
                'confidence'    => $history->confidence,
                'entropy'       => $history->entropy,
                'info'          => json_decode($history->info, true),
                'created_at'    => $history->created_at->toDateTimeString(),
            ],
        ]);
    }

    private function encodeImage($image)
    {
        $imageData = base64_encode(file_get_contents($image->getRealPath()));
        return 'data:' . $image->getMimeType() . ';base64,' . $imageData;
    }
}
