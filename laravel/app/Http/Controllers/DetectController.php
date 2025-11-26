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
            'image' => 'required|image|max:10240', // Validasi 10MB
        ]);

        try {
            $image = $request->file('image');
            $filename = $image->getClientOriginalName() ?: 'image.jpg';

            // Post ke FastAPI AI service
            $response = Http::attach(
                'file', 
                file_get_contents($image->getRealPath()), 
                $filename
            )->post('http://127.0.0.1:8080/predict');

            if ($response->failed()) {
                // Log error untuk debugging developer
                \Log::error('AI Service Error: ' . $response->body());
                return back()->withErrors(['api' => 'Gagal menghubungi layanan AI. Coba lagi nanti.']);
            }

            $result = $response->json();
            $imageData = base64_encode(file_get_contents($image->getRealPath()));
            $imageSrc = 'data:' . $image->getMimeType() . ';base64,' . $imageData;

            // Render halaman hasil
            return Inertia::render('detect/result', [
                'result' => $result,
                'image_url' => $imageSrc 
            ]);

        } catch (\Exception $e) {
            \Log::error('System Error: ' . $e->getMessage());
            return back()->withErrors(['system' => 'Terjadi kesalahan sistem.']);
        }
    }
}
