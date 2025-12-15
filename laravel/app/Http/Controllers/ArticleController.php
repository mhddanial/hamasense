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
            'articles' => $articles
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
                'image' => 'nullable|file|image|max:2048',
                // 'tags' => 'nullable|array',
                // 'summary' => 'nullable|string',
                // 'published_at' => 'nullable|date',
                // 'views_count' => 'nullable|integer',
                // 'estimated_read_time' => 'nullable|string',
                // 'related_article_ids' => 'nullable|array',
                // 'related_article_ids.*' => 'exists:articles,id'
            ]);

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

            // Sync Relationships
            // if (!empty($validated['related_article_ids'])) {
            //     $new_article->relatedArticles()->sync($validated['related_article_ids']);
            // }

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
                'title' => 'required|string',
                'slug' => 'nullable|string|unique:articles,slug,' . $article->id,
                'content' => 'required|string',
                'category_id' => 'required|int|exists:article_categories,id',
                'image' => 'nullable', // Can be string (old URL) or File (new upload)
                'status' => 'required|string|in:published,draft,scheduled',
                // 'tags' => 'nullable|string', // Frontend sends string "tag1, tag2"
                // 'summary' => 'nullable|string',
                // 'published_at' => 'nullable|date',
                // 'estimated_read_time' => 'nullable|string',
                // 'related_article_ids' => 'nullable|array',
            ]);

            // Handle Image Upload
            if ($request->hasFile('image')) {
                // Delete old image if exists and not default? (Optional, skip for now to be safe)
                $path = $request->file('image')->store('articles', 'public');
                $validated['image'] = '/storage/' . $path;
            } else {
                // If it's a string (old URL) or null, we don't need to update the 'image' column 
                // unless we want to allow clearing it?
                // For now, if no file is uploaded, we exclude 'image' from update to keep existing.
                // UNLESS the user explicitly wants to delete it? 
                // show.tsx sends 'image' as null if deleted.
                if ($request->input('image') === null) {
                   $validated['image'] = null;
                } else {
                   // It's a string (existing URL), so remove it from validated so we don't re-save URL string if logic handles paths differently
                   unset($validated['image']);
                }
            }
            
            // Handle tags if needed (convert string to array logic? Model casts array)
            // But user commented out tags logic in store, so keep it simple here too.

            $article->update($validated);
            
            // Sync relationships if needed
            // if ($request->has('related_article_ids')) {
            //      $article->relatedArticles()->sync($request->input('related_article_ids'));
            // }

            DB::commit();

            return to_route('article.index')->with('success', 'Article updated successfully'); // Redirect to index as standard
            
            // Original return JSON? Admin usually expects redirect. Frontend uses router.post/patch.
            /*
            return response()->json([
                'status' => true,
                'message' => 'Article updated successfully',
                'result' => $updated_article
            ]);
            */
        }catch(\Exception $e) {
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
