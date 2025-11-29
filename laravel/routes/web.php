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

    Route::get('/detect', [DetectController::class, 'index'])->name('detect.index');
    Route::post('/detect', [DetectController::class, 'store'])->name('detect.store');
    Route::get('/detect-history', [DetectController::class, 'listHistory'])->name('detect.history');

    Route::get('community', function () {
        return Inertia::render('community/index');
    })->name('community');

    Route::get('info-hama', function () {
        return Inertia::render('infoHama');
    })->name('info-hama');
});

// Google OAuth
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
