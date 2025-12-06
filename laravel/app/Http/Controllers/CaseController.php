<?php

namespace App\Http\Controllers;

use App\Models\Cases;
use App\Models\CaseLog;
use App\Models\CaseAction;
use App\Models\ScheduledCheck;
use App\Models\DetectionHistory;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CaseController extends Controller
{
    public function index()
    {
        $cases = Cases::where('user_id', auth()->id())
            ->orderBy('updated_at', 'desc')
            ->paginate(10);

        return Inertia::render('cases/index', [
            'cases' => $cases
        ]);
    }

    public function createFormDetection($historyId)
    {
        $history = DetectionHistory::where('user_id', auth()->id())
            ->findOrFail($historyId);

        $case = Cases::create([
            'user_id'              => auth()->id(),
            'detection_history_id' => $history->id,
            'label'                => $history->label,
            'image_path'           => $history->image_path,
            'status'               => 'active',
            'confidence'           => $history->confidence,
            'entropy'              => $history->entropy,
            'ai_summary'           => $history->info,
        ]);

        CaseLog::create([
            'case_id'     => $case->id,
            'message'     => 'Case dibuat dari hasil deteksi awal',
            'image_path'  => $history->image_path,
            'ai_response' => $history->info,
            'type'        => 'initial'
        ]);

        return redirect()->route('cases.show', $case->id)
            ->with('success', 'Perawatan berkelanjutan dimulai');
    }

    public function show($id)
    {
        $case = Cases::where('user_id', auth()->id())
            ->with(['logs', 'actions', 'ScheduledCheck'])
            ->findOrFail($id);

        return Inertia::render('continuous_care/index', [
            'case' => $case
        ]);
    }

    public function uploadFollowUp(Request $request, $caseId)
    {
        $request->validate([
            'image' => 'required|image|max:10240',
            'user_prompt' => 'required|string|max:1000',
        ]);

        $case = Cases::where('user_id', auth()->id())
            ->findOrFail($caseId);

        // Simpan Foto Baru
        $image = $request->file('image');
        $hashed = md5(uniqid(). time()). "." . $image->getClientOriginalExtension();
        $path = $image->storeAs('case_followups', $hashed, 'public');

        // Ambil Path Foto Lama (Original)
        // Asumsi image_path di tabel cases adalah path relatif dari storage/app/public
        // butuh absolute path untuk dikirim ke FastAPI atau stream contentnya.
        
        $oldImagePath = storage_path('app/public/' . $case->image_path);

        // Kirim ke FastAPI (Multimodal Request)
        try {
            // Kita kirim 2 file: file_old dan file_new
            $response = Http::attach(
                'file_old',
                file_get_contents($oldImagePath),
                basename($case->image_path)
            )->attach(
                'file_new',
                file_get_contents($image->getRealPath()),
                $image->getClientOriginalName()
            )->post('http://127.0.0.1:8080/analyze-followup', [
                'predicted_label' => $case->label,
                'confidence'      => $case->confidence,
                'user_prompt'     => $request->input('user_prompt'),
            ]);

            if ($response->failed()) {
                throw new \Exception("Analysis Service Error: " . $response->body());
            }

            $analysis = $response->json();

        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memproses analisis: ' . $e->getMessage());
        }

        // Simpan Log & Follow Up Record
        CaseLog::create([
            'case_id'     => $case->id,
            'image_path'  => $path,
            'message'     => 'Follow-up Analysis: ' . $request->input('user_prompt'),
            'ai_response' => json_encode($analysis),
            'type'        => 'follow_up'
        ]);
        
        // Update Status Case
        $case->update([
            'status' => 'follow_up_processed',
        ]);

        return back()->with('success', 'Analisis perawatan berkelanjutan berhasil!');
    }

    public function Close($id)
    {
        $case = Cases::where('user_id', auth()->id())
            ->findOrFail($id);
        
        $case->update([
            'status' => 'closed'
        ]);

        return back()->with('success', 'Perawatan selesai dan ditutup');
    }

    private function runAnalysis($image)
    {
        $response = Http::attach(
            'file',
            file_get_contents($image->getRealPath()),
            $image->getClientOriginalName()
        )->post('http://127.0.0.1:8080/predict');

        if ($response->failed()) {
            throw new \Exception("FastAPI error: " . $response->body());
        }

        return $response->json();
    }
}
