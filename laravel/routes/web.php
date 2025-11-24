<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DetectController;
use App\Http\Controllers\CommunityPostController;

// Public Pages
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/articles', [HomeController::class, 'articles'])->name('articles.index');
Route::get('/articles/{slug}', [HomeController::class, 'articleShow'])->name('articles.show');

// User Dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard', [
            'user' => Auth::user(),
        ]);
    })->name('dashboard');

    Route::get('detect', [DetectController::class, 'index'])->name('detect');
    Route::post('detect', [DetectController::class, 'store'])->name('detect.store');

    // Testing halaman deteksi frontend
    Route::get('/detect-result', function () {
        return Inertia::render('detect/test-result');
    })->name('detect.result');

    Route::post('/detect/store', [DetectController::class, 'store'])->name('detect.store');
    
    Route::get('/riwayat-deteksi', function() {
        return Inertia::render('riwayatDeteksi');
    })->name('riwayatDeteksi');

    Route::get('info-hama', function () {
        return Inertia::render('infoHama');
    })->name('infoHama');

    Route::get('/community', [CommunityPostController::class, 'index'])->name('community.index');
});

// Google OAuth
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
