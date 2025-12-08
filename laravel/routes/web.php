<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CaseController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\DetectController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CommunityPostController;
use App\Http\Controllers\Auth\GoogleAuthController;

// Public Pages
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/articles', [HomeController::class, 'articles'])->name('articles.index');
Route::get('/articles/{slug}', [HomeController::class, 'articleShow'])->name('articles.show');

// Community Routes (Public dapat melihat, tapi harus login untuk create/update/delete)
Route::get('/community', [CommunityPostController::class, 'index'])->name('community');

// User Dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/weather-location', [DashboardController::class, 'updateWeatherByGPS'])
    ->name('weather.update-location');

    Route::get('/detect', [DetectController::class, 'index'])->name('detect.index');
    Route::post('/detect', [DetectController::class, 'store'])->name('detect.store');
    Route::post('/detect/save-history', [DetectController::class, 'saveHistory'])->name('detect.save');
    // Konek database
    Route::get('/detect-history', [DetectController::class, 'listHistory'])->name('detect.history');

    // Frontend history
    Route::get('/detect-history-test', function () {
        return Inertia::render('detect/history');
    })->name('detect.history.test');

    Route::get('/detect-history/{id}', [DetectController::class, 'showHistory'])->name('detect.history.detail');

    Route::get('/pest-info', function () {
        return Inertia::render('pest-info/index');
    })->name('pest.index');

    Route::get('/pest-detail', function () {
        return Inertia::render('pest-info/pestDetails');
    })->name('pest.detail');

    Route::get('/continuous-care', function() {
        return Inertia::render('continuous_care/index');
    })->name('continuous_care.index');

    Route::get('/community', [CommunityPostController::class, 'index'])->name('community.index');

    Route::get('/cases', [CaseController::class, 'index'])->name('cases.index');
    Route::post('/cases/create-from-detection/{historyId}', [CaseController::class, 'createFormDetection'])->name('cases.createFormDetection');
    Route::get('/cases/{id}', [CaseController::class, 'show'])->name('cases.show');
    Route::post('/cases/{caseId}/follow-up', [CaseController::class, 'uploadFollow'])->name('cases.followUp');
    Route::post('/cases/{caseId}/close', [CaseController::class, 'close'])->name('cases.close');
});

// Google OAuth
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';