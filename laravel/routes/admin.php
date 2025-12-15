<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PestController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\DiseaseController;
use App\Http\Controllers\PlantTypeController;
use App\Http\Controllers\ArticleCategoryController;

Route::middleware('admin')->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);

    Route::resource('/pest', PestController::class);
    Route::resource('/plant', PlantTypeController::class);
    Route::resource('/article', ArticleController::class);
    Route::resource('/article-category', ArticleCategoryController::class);
    Route::resource('/disease', DiseaseController::class);
});

Route::get('/user', [AdminController::class, 'user']);

// Route::prefix('/api')->group(function () {
//     Route::apiResource('/article', ArticleController::class);

//     Route::apiResource('/article_category', ArticleCategoryController::class);
//     Route::apiResource('/pest', PestController::class);

// });
