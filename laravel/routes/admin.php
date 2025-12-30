<?php


use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PestController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\DiseaseController;
use App\Http\Controllers\PlantTypeController;
use App\Http\Controllers\ArticleCategoryController;
use App\Http\Controllers\PestCategoryController;
use App\Http\Controllers\UserController;


Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // User Management
    Route::get('/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
    Route::patch('/users/{user}/role', [UserController::class, 'updateRole'])->name('admin.users.updateRole');

    Route::resource('/pest', PestController::class);
    Route::resource('/pest-category', PestCategoryController::class);
    Route::resource('/plant', PlantTypeController::class);
    Route::resource('/article', ArticleController::class);
    Route::resource('/article-category', ArticleCategoryController::class);
    Route::resource('/disease', DiseaseController::class);
});
