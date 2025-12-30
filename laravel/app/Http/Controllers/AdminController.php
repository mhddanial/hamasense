<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\User;
use App\Models\DetectionHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        $year = $request->input('year', date('Y'));

        $detectionTrend = DetectionHistory::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->whereYear('created_at', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->month => $item->count];
            });

        // Ensure all 12 months are present
        $monthlyData = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthlyData[] = [
                'month' => date('M', mktime(0, 0, 0, $i, 1)),
                'value' => $detectionTrend->get($i, 0)
            ];
        }

        return Inertia::render('admin/dashboard', [
            'detectionTrend' => $monthlyData,
            'selectedYear' => (int)$year
        ]);
    }

    public function user()
    {
        return response()->json([
            'users'=> User::all(),
            'logged_in' => Auth::user()
        ]);
    }
}
