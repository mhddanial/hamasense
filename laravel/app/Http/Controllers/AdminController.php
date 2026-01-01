<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\DetectionHistory;
use App\Models\Article;
use App\Models\Pest;
use App\Models\CommunityPost;
use App\Models\PlantType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        $year = $request->input('year', date('Y'));

        // Detection trend by month
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

        // Statistics counts
        $totalUsers = User::count();
        $newUsersThisMonth = User::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();
        $totalDetections = DetectionHistory::count();
        $totalArticles = Article::count();
        $totalPests = Pest::count();
        $totalCommunityPosts = CommunityPost::count();
        $totalPlantTypes = PlantType::count();

        // Detection distribution by label for pie chart
        $detectionByLabel = DetectionHistory::selectRaw('label, COUNT(*) as count')
            ->whereNotNull('label')
            ->groupBy('label')
            ->orderByDesc('count')
            ->limit(6)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->label ?? 'Unknown',
                    'value' => $item->count
                ];
            });

        // Recent detections with user info
        $recentDetections = DetectionHistory::with('user:id,name,email,avatar')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function ($detection) {
                return [
                    'id' => $detection->id,
                    'label' => $detection->label ?? 'Unknown',
                    'confidence' => $detection->confidence ? round($detection->confidence * 100, 1) : null,
                    'created_at' => $detection->created_at->diffForHumans(),
                    'user' => $detection->user ? [
                        'name' => $detection->user->name,
                        'avatar' => $detection->user->avatar_url,
                    ] : null,
                ];
            });

        return Inertia::render('admin/dashboard', [
            'detectionTrend' => $monthlyData,
            'selectedYear' => (int)$year,
            'stats' => [
                'totalUsers' => $totalUsers,
                'newUsersThisMonth' => $newUsersThisMonth,
                'totalDetections' => $totalDetections,
                'totalArticles' => $totalArticles,
                'totalPests' => $totalPests,
                'totalCommunityPosts' => $totalCommunityPosts,
                'totalPlantTypes' => $totalPlantTypes,
            ],
            'detectionByLabel' => $detectionByLabel,
            'recentDetections' => $recentDetections,
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
