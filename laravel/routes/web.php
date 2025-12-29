<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\CaseController;
use App\Http\Controllers\PestController;
use App\Http\Controllers\DetectController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CommunityPostController;
use App\Http\Controllers\Auth\GoogleAuthController;

Route::get('/test-ai', function () {
    return Http::post(config('services.fastapi.url').'/health')->json();
});

// Public Pages
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about', [HomeController::class, 'about'])->name('about');
Route::get('/articles', [HomeController::class, 'articles'])->name('articles.index');
Route::get('/articles/{slug}', [HomeController::class, 'articleShow'])->name('articles.show');

// Community Routes - Public bisa lihat, login untuk aksi
Route::get('/community', [CommunityPostController::class, 'index'])->name('community.index');

// USER ACCESS
Route::middleware(['auth', 'verified', 'customer'])->group(function () {
    // DASHBOARD USER
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/dashboard/weather-location', [DashboardController::class, 'updateWeatherByGPS'])
    ->name('weather.update-location');

    // DETECTION
    Route::get('/detect', [DetectController::class, 'index'])->name('detect.index');
    Route::post('/detect', [DetectController::class, 'store'])->name('detect.store');
    Route::post('/detect/save-history', [DetectController::class, 'saveHistory'])->name('detect.save');
    Route::get('/detect-history', [DetectController::class, 'listHistory'])->name('detect.history');
    Route::get('/detect-history/{id}', [DetectController::class, 'showHistory'])->name('detect.history.detail');
    Route::delete('/detect-history/{id}', [DetectController::class, 'deleteHistory'])->name('detect.history.delete');

    // Community CRUD
    Route::post('/community', [CommunityPostController::class, 'store'])->name('community.store');
    Route::put('/community/{post}', [CommunityPostController::class, 'update'])->name('community.update');
    Route::delete('/community/{post}', [CommunityPostController::class, 'destroy'])->name('community.destroy');

    // PEST INFO
    Route::get('/pest-info', [PestController::class, 'userIndex'])->name('pest.user.index');
    Route::get('/pest-info/{slug}', [PestController::class, 'userShow'])->name('pest.user.show');

    // Community Like & Comment
    Route::post('/community/{post}/like', [CommunityPostController::class, 'toggleLike'])->name('community.like');
    Route::get('/community/{post}/comments', [CommunityPostController::class, 'getComments'])->name('community.comments');
    Route::post('/community/{post}/comments', [CommunityPostController::class, 'storeComment'])->name('community.comment.store');

    // CONTINUOUS CARE
    Route::get('/continuous-care', function() {
        return Inertia::render('continuous_care/index');
    })->name('continuous_care.index');
    Route::get('/cases', [CaseController::class, 'index'])->name('cases.index');
    Route::post('/cases/create-from-detection/{historyId}', [CaseController::class, 'createFormDetection'])->name('cases.createFormDetection');
    Route::get('/cases/{id}', [CaseController::class, 'show'])->name('cases.show');
    Route::post('/cases/{caseId}/follow-up', [CaseController::class, 'uploadFollowUp'])->name('cases.followUp');
    Route::post('/cases/{caseId}/close', [CaseController::class, 'close'])->name('cases.close');
});

// Google OAuth
Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('google.redirect');
Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
