<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index(Request $request)
    {
        $keyword = $request->query('keyword');
        $articles = Article::query()->with(['category', 'writer'])->when($keyword, function ($query, $keyword) {
            $search_term = "%{$keyword}%";
            return $query->where(function ($q) use ($search_term) {
                $q->where('title', 'like', $search_term);
            });
        })->latest()->paginate(12);

        return Inertia::render('admin/article/index', [
            'articles' => $articles
        ]);
    }

    public function create()
    {
        $articles = Article::all();
        $categories = ArticleCategory::all();

        return Inertia::render('admin/article/create', [
            // 'articles' => $articles, 
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $field = $request->validate([
                'title' => 'required|string',
                'content' => 'required|string',
                'category_id' => 'required|int|min:1',
                'img_path' => 'image'
            ]);

            if($request->hasFile('img_path')) {

                $file = $request->file('img_path');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();

                $file->storeAs('article', $file_name, 'public');
                $field['img_path'] = $file_name;
            }


            $user = Auth::user();
            $field['writer_id'] = $user->id;
            
            $new_article = Article::create($field);

            DB::commit();
            return redirect('/admin/article')->with('success', 'Article category created successfully');
            
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

    public function show(Request $request, Article $article)
    {
        return Inertia::render('admin/article/show', [
            'article' => $article->load('category'),
            'categories' => ArticleCategory::all() 
        ]);
    }

    public function update(Request $request, Article $article)
    {
        DB::beginTransaction();

        try{

            $field = $request->validate([
                'title' => 'required|string',
                'content' => 'required|string',
                'category_id' => 'required|int|min:1',
                'old_img' => 'string|nullable',
                'new_img' => 'image|nullable'
            ]);

            if($request->hasFile('new_img')) {
                $file = $request->file('new_img');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('article', $file_name, 'public');
                $field['img_path'] = $file_name;
            }

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
