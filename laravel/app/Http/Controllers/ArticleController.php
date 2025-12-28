<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Article;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ArticleCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
            'articles' => $articles,
            'categories' => ArticleCategory::all()
        ]);
    }

    public function create()
    {
        $articles = Article::all();
        $categories = ArticleCategory::all();

        return Inertia::render('admin/article/create', [
            'articles' => $articles, 
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $validated = $request->validate([
                'title' => 'required|string',
                'slug' => 'nullable|string|unique:articles,slug',
                'content' => 'required|string',
                'category_id' => 'required|int|exists:article_categories,id',
                'img_path' => 'nullable|file|image|max:2048',
                'references' => 'nullable|array',
                'references.*.source_name' => 'nullable|string',
                'references.*.url' => 'nullable|string',
            ]);

            // Filter out empty references
            if (!empty($validated['references'])) {
                $validated['references'] = array_filter($validated['references'], function($ref) {
                    return !empty($ref['source_name']) || !empty($ref['url']);
                });
                $validated['references'] = array_values($validated['references']); // Re-index
            }

            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['title']) . '-' . uniqid(); 
            }

            $user = Auth::user();
            $validated['writer_id'] = $user->id;

            // Handle Image Upload
            if ($request->hasFile('image')) {
                // Store in 'public/articles'
                $path = $request->file('image')->store('articles', 'public');
                $validated['image'] = '/storage/' . $path;
            }

            // Create Article
            $new_article = Article::create($validated);

            DB::commit();

            return to_route('article.index')->with('success', 'Article created successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }

    public function show(Request $request, Article $article)
    {
        $article->load(['category', 'relatedArticles']);
        $articles = Article::where('id', '!=', $article->id)->select('id', 'title')->get();

        return Inertia::render('admin/article/show', [
            'article' => $article,
            'categories' => ArticleCategory::all(),
            'articles' => $articles // For related selection
        ]);
    }

    public function update(Request $request, Article $article)
    {
        DB::beginTransaction();

        try{
            // Validate similar to store, but minimal required fields from edit form
            $validated = $request->validate([
                'image' => 'nullable',
                'title' => 'required|string',
                'category_id' => 'required|int|exists:article_categories,id',
                'content' => 'required|string',
                'slug' => 'nullable|string|unique:articles,slug,' . $article->id,
                'references' => 'nullable|array',
                'references.*.source_name' => 'nullable|string',
                'references.*.url' => 'nullable|string',
            ]);

            // Filter out empty references
            if (!empty($validated['references'])) {
                $validated['references'] = array_filter($validated['references'], function($ref) {
                    return !empty($ref['source_name']) || !empty($ref['url']);
                });
                $validated['references'] = array_values($validated['references']); // Re-index
            }

            // Handle Image Upload
            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('articles', 'public');
                $validated['image'] = '/storage/' . $path;
            } else {
                if ($request->input('image') === null) {
                   $validated['image'] = null;
                } else {
                   unset($validated['image']);
                }
            }

            $article->update($validated);

            DB::commit();

            return redirect()->route('article.index')->with('success', 'Article updated successfully'); // Redirect to index as standard

        } catch(\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }

    public function destroy(Request $request, Article $article)
    {
        DB::beginTransaction();
        
        try{
            $article->delete();

            DB::commit();
            return redirect()->route('article.index')->with('success', 'Article deleted successfully');
        } catch(\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }
}
