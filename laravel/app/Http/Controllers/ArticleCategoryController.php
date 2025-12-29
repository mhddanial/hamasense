<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\ArticleCategory;
use Illuminate\Support\Facades\DB;

class ArticleCategoryController extends Controller
{
    public function index()
    {
        $categories = ArticleCategory::all();

        return Inertia::render('admin/article_category/index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $field = $request->validate([
                'name' => 'required|string',
           ]);

            $article_cat = ArticleCategory::create($field);

            DB::commit();
            return redirect()->back()->with('success', 'Article category created successfully');
        } catch(\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error when creating category: ' . $e->getMessage());
        }
    }

    public function update(Request $request, ArticleCategory $article_category)
    {
        DB::beginTransaction();

        try {
            $field = $request->validate([
                'name' => 'required|string',
            ]);

            $article_cat = $article_category->update($field);

            DB::commit();
            return redirect()->back()->with('success', 'Article category updated successfully');
        } catch(\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Error when updating category: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, ArticleCategory $article_category)
    {
        DB::beginTransaction();

        try {
            $article_category->delete();
            DB::commit();

            return redirect()->back()->with('success', 'Article category deleted successfully');
        } catch(\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Error when deleting category: ' . $e->getMessage());
        }
    }
}
