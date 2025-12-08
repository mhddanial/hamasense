<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class AiDetectionService {
    public function detect() {
        $filename = $image->getClientOriginalName() ?: 'image.jpg';

        // Mengirim response ke FastAPI
        $response = Http::attach(
            'file',
            file_get_contents($image->getRealPath()),
            $filename
        )->post('http://127.0.0.1:8080/predict');

        if($response->failed()) {
            throw new \Exception('AI Service Failed: '. $response->body());
        }

        return $response->json();
    }
}