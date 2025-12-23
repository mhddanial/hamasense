<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard () 
    {
        $detection_total = 1;
        $active_user = User::count();
        $article_total = Article::count();
        $ai_ccuracy = 1;

        return Inertia::render('admin/dashboard', [
            'detection_total' => $detection_total,
            'active_user' => $active_user,
            'article_total' => $article_total,
            'ai_accuracy' => $ai_ccuracy
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
