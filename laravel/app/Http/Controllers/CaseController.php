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

        // Check if case already exists for this history
        $existingCase = Cases::where('detection_history_id', $history->id)->first();
        if ($existingCase) {
             return redirect()->route('cases.show', $existingCase->id);
        }

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
            ->with(['logs' => function ($query) {
                $query->orderBy('created_at', 'asc');
            }, 'actions', 'ScheduledCheck'])
            ->findOrFail($id);

        $now = \Carbon\Carbon::now();
        $caseCreatedAt = \Carbon\Carbon::parse($case->created_at);
        $daysSinceCreation = $caseCreatedAt->diffInDays($now);
        
        // KONSTAN BATAS
        $TRIAL_DAYS = 3;
        $MAX_DAILY_PROMPTS = 5;
        $MAX_DAILY_PHOTOS = 2;

        $isTrialExpired = $daysSinceCreation >= $TRIAL_DAYS;

        // Menghitung penggunaan harian
        $todayLogs = $case->logs()
            ->whereDate('created_at', \Carbon\Carbon::today())
            ->where('type', 'follow_up') // Hanya menghitung interaksi pengguna
            ->get();

        $dailyPromptsUsed = $todayLogs->count();
        $dailyPhotosUsed = $todayLogs->whereNotNull('image_path')->count();

        $remainingPrompts = max(0, $MAX_DAILY_PROMPTS - $dailyPromptsUsed);

        // Pengguna hanya bisa mengunggah jika mereka memiliki kuota foto DAN kuota prompt (karena unggahan mengonsumsi 1 prompt)
        $canUploadPhoto = ($dailyPhotosUsed < $MAX_DAILY_PHOTOS) && ($remainingPrompts > 0);

        // --- HEALTH CHECK POPUP LOGIC ---
        // Tampilkan popup jika:
        // 1. Sudah hari ke-2 atau lebih (daysSinceCreation >= 1)
        // 2. Kondisi belum diset (null) atau masih 'sick' tapi perlu konfirmasi ulang (opsional, saat ini check null saja)
        // 3. User belum menutup case (status != closed)
        $showHealthCheckPopup = ($daysSinceCreation >= 1) && ($case->condition === null) && ($case->status !== 'closed');

        return Inertia::render('continuous_care/index', [
            'case' => $case,
            'quota' => [
                'is_trial_expired' => $isTrialExpired,
                'days_left' => max(0, $TRIAL_DAYS - $daysSinceCreation),
                'daily_prompts_used' => $dailyPromptsUsed,
                'daily_prompts_max' => $MAX_DAILY_PROMPTS,
                'remaining_prompts' => $remainingPrompts,
                'daily_photos_used' => $dailyPhotosUsed,
                'daily_photos_max' => $MAX_DAILY_PHOTOS,
                'can_upload_photo' => $canUploadPhoto,
            ],
            'showHealthCheckPopup' => $showHealthCheckPopup
        ]);
    }

    public function updateCondition(Request $request, $id)
    {
        $case = Cases::where('user_id', auth()->id())->findOrFail($id);
        
        $request->validate([
            'condition' => 'required|in:Healthy,Sick',
        ]);

        $condition = $request->condition;
        $case->update(['condition' => $condition]);

        if ($condition === 'Healthy') {
            CaseLog::create([
                'case_id' => $case->id,
                'message' => 'Laporan Pengguna: Tanaman sudah sehat.',
                'type' => 'system'
            ]);
        } else {
             CaseLog::create([
                'case_id' => $case->id,
                'message' => 'Laporan Pengguna: Tanaman masih sakit.',
                'type' => 'system'
            ]);
        }

        return back()->with('success', 'Status kondisi tanaman diperbarui.');
    }

    public function uploadFollowUp(Request $request, $caseId)
    {
        $case = Cases::where('user_id', auth()->id())->findOrFail($caseId);

        // === QUOTA ===
        $now = \Carbon\Carbon::now();
        $caseCreatedAt = \Carbon\Carbon::parse($case->created_at);
        if ($caseCreatedAt->diffInDays($now) >= 3) {
            return back()->withErrors(['quota' => 'Masa percobaan gratis 3 hari telah habis. Silakan berlangganan.']);
        }

        $todayLogs = $case->logs()
            ->whereDate('created_at', \Carbon\Carbon::today())
            ->where('type', 'follow_up')
            ->get();

        $dailyPromptsUsed = $todayLogs->count();
        $MAX_DAILY_PROMPTS = 5;

        // Periksa kuota prompt (unggahan juga dihitung sebagai penggunaan prompt)
        if ($dailyPromptsUsed >= $MAX_DAILY_PROMPTS) {
            return back()->withErrors(['quota' => 'Kuota chat harian Anda (5x) telah habis.']);
        }

        // Jika mencoba mengunggah gambar, periksa kuota foto
        if ($request->hasFile('image')) {
            $dailyPhotosUsed = $todayLogs->whereNotNull('image_path')->count();
            if ($dailyPhotosUsed >= 2) {
                return back()->withErrors(['quota' => 'Kuota upload foto harian Anda (2x) telah habis.']);
            }
        }

        $request->validate([
            'image' => 'nullable|image|max:10240',
            'user_prompt' => 'nullable|string|max:1000',
        ]);

        if (!$request->hasFile('image') && !$request->input('user_prompt')) {
             return back()->withErrors(['user_prompt' => 'Mohon sertakan foto atau pesan.']);
        }

        // Simpan Foto Baru
        $path = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $hashed = md5(uniqid(). time()). "." . $image->getClientOriginalExtension();
            $path = $image->storeAs('case_followups', $hashed, 'public');
        }

        // Ambil Path Foto Lama (Original)
        // Asumsi image_path di tabel cases adalah path relatif dari storage/app/public
        // butuh absolute path untuk dikirim ke FastAPI atau stream contentnya.
        
        $oldImagePath = storage_path('app/public/' . $case->image_path);

        // Kirim ke FastAPI (Multimodal Request)
        try {
            // kirim 2 file: file_old dan file_new (jika ada)
            $http = Http::attach(
                'file_old',
                file_get_contents($oldImagePath),
                basename($case->image_path)
            );

            if ($request->hasFile('image')) {
                 $http->attach(
                    'file_new',
                    file_get_contents($request->file('image')->getRealPath()),
                    $request->file('image')->getClientOriginalName()
                );
            }

            $response = $http->post('http://127.0.0.1:8080/analyze-followup', [
                'predicted_label' => $case->label,
                'confidence'      => $case->confidence,
                'user_prompt'     => $request->input('user_prompt') ?? 'Mohon analisa kondisi terkini.',
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
            'image_path'  => $path, // bisa null
            'message'     => $request->input('user_prompt') ?? 'Update Foto',
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
