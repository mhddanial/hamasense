<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DetectController extends Controller
{
    public function index()
    {
        return Inertia::render('detect/index');
    }

    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'image' => 'required|image|max:10240',
        ]);

        try {
            // 2. Ambil file dari request
            $image = $request->file('image');
            
            // 3. Kirim ke FastAPI (Python Service)
            $response = Http::attach(
                'file', file_get_contents($image), $image->getClientOriginalName()
            )->post('http://127.0.0.1:8080/predict');

            // Cek jika API Python error
            if ($response->failed()) {
                return back()->withErrors(['api' => 'Gagal menghubungi layanan AI. Coba lagi nanti.']);
            }

            $result = $response->json();

            // 4. (Opsional) Simpan ke Database History di sini
            // DetectionHistory::create([...]);

            // 5. Render Halaman Hasil dengan Data
            return Inertia::render('detect/result', [
                'result' => $result,
                'image_url' => null // Nanti kita handle preview di frontend atau upload ke storage jika perlu
            ]);

        } catch (\Exception $e) {
            return back()->withErrors(['system' => 'Terjadi kesalahan sistem: ' . $e->getMessage()]);
        }
    }
}
