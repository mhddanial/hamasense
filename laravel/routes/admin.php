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
use App\Http\Controllers\CommunityAdminController;


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

    // Community Management
    Route::get('/community', [CommunityAdminController::class, 'index'])->name('admin.community.index');
    Route::get('/community/reports', [CommunityAdminController::class, 'reports'])->name('admin.community.reports');
    Route::get('/community/{post}', [CommunityAdminController::class, 'show'])->name('admin.community.show');
    Route::delete('/community/{post}', [CommunityAdminController::class, 'destroy'])->name('admin.community.destroy');
    Route::delete('/community/comment/{comment}', [CommunityAdminController::class, 'destroyComment'])->name('admin.community.comment.destroy');
    Route::patch('/community/reports/{report}', [CommunityAdminController::class, 'reviewReport'])->name('admin.community.reports.review');

    // Community Category Management
    Route::post('/community-category', [CommunityAdminController::class, 'storeCategory'])->name('admin.community.category.store');
    Route::patch('/community-category/{category}', [CommunityAdminController::class, 'updateCategory'])->name('admin.community.category.update');
    Route::delete('/community-category/{category}', [CommunityAdminController::class, 'destroyCategory'])->name('admin.community.category.destroy');
});

