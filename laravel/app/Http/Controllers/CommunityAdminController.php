<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\CommunityPost;
use App\Models\CommunityReport;
use App\Models\CommunityComments;
use App\Models\CommunityCategory;
use Illuminate\Support\Facades\Auth;

class CommunityAdminController extends Controller
{
    /**
     * Display a listing of community posts for admin.
     */
    public function index(Request $request)
    {
        $keyword = $request->query('keyword');
        $category = $request->query('category');
        $sortBy = $request->query('sort', 'latest');

        $posts = CommunityPost::query()
            ->with(['owned_by:id,name,email,avatar', 'comments', 'reports'])
            ->withCount(['likes', 'allComments', 'reports'])
            ->when($keyword, function ($query, $keyword) {
                $searchTerm = "%{$keyword}%";
                return $query->where(function ($q) use ($searchTerm) {
                    $q->where('title', 'like', $searchTerm)
                      ->orWhere('content', 'like', $searchTerm)
                      ->orWhereHas('owned_by', function ($q) use ($searchTerm) {
                          $q->where('name', 'like', $searchTerm);
                      });
                });
            })
            ->when($category && $category !== 'all', function ($query) use ($category) {
                return $query->where('category', $category);
            });

        // Apply sorting
        switch ($sortBy) {
            case 'oldest':
                $posts->oldest();
                break;
            case 'most_liked':
                $posts->orderBy('likes_count', 'desc');
                break;
            case 'most_commented':
                $posts->orderBy('all_comments_count', 'desc');
                break;
            case 'most_reported':
                $posts->orderBy('reports_count', 'desc');
                break;
            default:
                $posts->latest();
                break;
        }

        $posts = $posts->paginate(10);

        // Get categories from database
        $categories = CommunityCategory::all(['id', 'slug', 'name']);

        return Inertia::render('admin/community/index', [
            'posts' => $posts,
            'categories' => $categories,
            'filters' => [
                'keyword' => $keyword,
                'category' => $category,
                'sort' => $sortBy,
            ],
        ]);
    }

    /**
     * Display a specific community post details.
     */
    public function show($id)
    {
        $post = CommunityPost::with([
            'owned_by:id,name,email,avatar',
            'allComments.user:id,name,avatar',
            'allComments.replies.user:id,name,avatar',
            'reports.reporter:id,name,email',
        ])
        ->withCount(['likes', 'allComments', 'reports'])
        ->findOrFail($id);

        return Inertia::render('admin/community/show', [
            'post' => $post,
        ]);
    }

    /**
     * Delete a community post.
     */
    public function destroy($id)
    {
        $post = CommunityPost::findOrFail($id);
        $post->delete();

        return redirect()->route('admin.community.index')
            ->with('success', 'Postingan berhasil dihapus');
    }

    /**
     * Delete a comment.
     */
    public function destroyComment($id)
    {
        $comment = CommunityComments::findOrFail($id);
        $postId = $comment->post_id;
        $comment->delete();

        return redirect()->route('admin.community.show', $postId)
            ->with('success', 'Komentar berhasil dihapus');
    }

    /**
     * Display list of reports.
     */
    public function reports(Request $request)
    {
        $status = $request->query('status', 'pending');

        $reports = CommunityReport::with([
            'post:id,title,content,category,created_by',
            'post.owned_by:id,name,email,avatar',
            'reporter:id,name,email,avatar',
            'reviewer:id,name',
        ])
        ->when($status !== 'all', function ($query) use ($status) {
            return $query->where('status', $status);
        })
        ->latest()
        ->paginate(10);

        return Inertia::render('admin/community/reports', [
            'reports' => $reports,
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    /**
     * Review a report (mark as reviewed or dismissed).
     */
    public function reviewReport(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:reviewed,dismissed',
        ]);

        $report = CommunityReport::findOrFail($id);
        $report->update([
            'status' => $request->status,
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        $message = $request->status === 'reviewed' 
            ? 'Laporan ditandai sudah ditinjau' 
            : 'Laporan dibatalkan';

        return back()->with('success', $message);
    }

    /**
     * Store a new community category.
     */
    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $slug = \Illuminate\Support\Str::slug($validated['name']);

        CommunityCategory::create([
            'name' => $validated['name'],
            'slug' => $slug,
        ]);

        return back()->with('success', 'Kategori berhasil ditambahkan');
    }

    /**
     * Update a community category.
     */
    public function updateCategory(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category = CommunityCategory::findOrFail($id);
        $category->update([
            'name' => $validated['name'],
            'slug' => \Illuminate\Support\Str::slug($validated['name']),
        ]);

        return back()->with('success', 'Kategori berhasil diperbarui');
    }

    /**
     * Delete a community category.
     */
    public function destroyCategory($id)
    {
        $category = CommunityCategory::findOrFail($id);
        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus');
    }
}
