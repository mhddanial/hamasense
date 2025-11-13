<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        // $user = Auth::user();

        // $articles = Article::where('writer_id', $user->id)->get();

        $articles = Article::all();

        return Inertia::render('admin/article/index', [
            'articles' => $articles
        ]);
    }

    public function dashboard()
    {
        return Inertia::render('admin/article/index');
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $field = $request->validate([
                'title' => 'required|string',
                'content' => 'required|string',
                'category' => 'required|number|min:1'
            ]);

            $user = Auth::user();
            $field['writer_id'] = $user->id;
            
            $new_article = Article::create($field);

            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Article created successfully',
                'result' => $new_article
            ]);
        } catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
        
    }

    public function update(Request $request, Article $article)
    {
        DB::beginTransaction();

        try{

            $field = $request->validate([
                'title' => 'required|string',
                'content' => 'required|string',
                'category' => 'required|number|min:1'
            ]);

            $updated_article = $article->update($field);

            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Article updated successfully',
                'result' => $updated_article
            ]);
        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function destroy(Request $request, Article $article)
    {
        DB::beginTransaction();
        
        try{
            $article->delete();

            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Article deleted successfully',
            ]);
        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }
}
