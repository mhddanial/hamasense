<?php

namespace App\Http\Controllers;

use App\Models\ArticleCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ArticleCategoryController extends Controller
{
    public function index()
    {
        return response()->json([
            'result' => ArticleCategory::all()
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
            return response()->json([
                'status' => true,
                'message' => 'Article category created successfully',
                'result' => $article_cat
            ]);
        } catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
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
            return response()->json([
                'status' => true,
                'message' => 'Article created successfully',
                'result' => $article_cat
            ]);
        } catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function destroy(Request $request, ArticleCategory $article_category)
    {
        DB::beginTransaction();

        try {
            $article_category->delete();
            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Article created successfully',
                'result' => $article_category
            ]);
        } catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
