<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ArticleCategoryController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\PestController;
use App\Http\Controllers\PlantTypeController;
use Inertia\Inertia;

Route::prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'dashboard']);

    Route::resource('/pest', PestController::class);
    Route::resource('/article', ArticleController::class);
    Route::resource('/plant', PlantTypeController::class);
    
    // Route::prefix('article')->group(function () {
    //     Route::get('/', [ArticleController::class, 'dashboard']);

    //     Route::get('/edit/{id}', [PestController::class, 'edit']);

    //     Route::get('/new', [PestController::class, 'create']);
    // });
});

    Route::get('/user', [AdminController::class, 'user']);



    Route::prefix('/api')->group(function () {
        Route::apiResource('/article', ArticleController::class);

        Route::apiResource('/article_category', ArticleCategoryController::class);
        Route::apiResource('/pest', PestController::class);

});

