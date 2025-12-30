<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PestController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\DiseaseController;
use App\Http\Controllers\PlantTypeController;
use App\Http\Controllers\ArticleCategoryController;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::get('/user', [AdminController::class, 'user']);
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::resource('/pest', PestController::class)->parameters(['pest' => 'pest:slug']);
    Route::resource('/plant', PlantTypeController::class)->parameters(['plant' => 'plant:slug']);
    Route::resource('/article', ArticleController::class)->parameters(['article' => 'article:slug']);
    Route::resource('/article-category', ArticleCategoryController::class);
    Route::resource('/disease', DiseaseController::class)->parameters(['disease' => 'disease:slug']);
});

// Route::prefix('/api')->group(function () {
//     Route::apiResource('/article', ArticleController::class);

//     Route::apiResource('/article_category', ArticleCategoryController::class);
//     Route::apiResource('/pest', PestController::class);

// });
