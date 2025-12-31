<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\CommunityPost;
use App\Models\CommunityLikes;
use App\Models\CommunityComments;
use App\Models\CommunityReport;
use App\Models\CommunitySavedPost;
use App\Models\CommunityCategory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;


class CommunityPostController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $posts = CommunityPost::with('owned_by')
            ->withCount('comments')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($post) use ($userId) {
                return [
                    'id' => $post->id,
                    'author' => [
                        'id' => $post->owned_by->id,
                        'name' => $post->owned_by->name,
                        'avatar' => $post->owned_by->avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . $post->owned_by->name,
                    ],
                    'timestamp' => $post->created_at->diffForHumans(),
                    'category' => $post->category,
                    'content' => $post->content,
                    'image' => $post->image_url,
                    'likes' => $post->like_total,
                    'comments' => $post->comments_count,
                    'isLiked' => $post->isLikedBy($userId),
                    'isBookmarked' => $post->isSavedBy($userId),
                ];
            });

        $categories = CommunityCategory::all(['slug', 'name']);

        return Inertia::render('community/index', [
            'initialPosts' => $posts,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        try {
            // Validasi
            $validated = $request->validate([
                'category' => 'required|string',
                'content' => 'required|string',
                'image' => 'nullable|string',
            ]);

            // Handle image upload jika ada
            $imagePath = null;
            if ($request->image) {
                $image = $request->image;
                if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
                    $image = substr($image, strpos($image, ',') + 1);
                    $type = strtolower($type[1]);

                    $image = base64_decode($image);
                    $imageName = Str::random(20) . '.' . $type;

                    Storage::disk('public')->put('community_posts/' . $imageName, $image);
                    $imagePath = 'community_posts/' . $imageName;
                }
            }

            // Simpan post
            $post = CommunityPost::create([
                'title' => '',
                'content' => $validated['content'],
                'category' => $validated['category'],
                'image' => $imagePath,
                'like_total' => 0,
                'created_by' => auth()->id(),
            ]);

            $post->load('owned_by');

            $newPost = [
                'id' => $post->id,
                'author' => [
                    'id' => $post->owned_by->id,
                    'name' => $post->owned_by->name,
                    'avatar' => $post->owned_by->avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . $post->owned_by->name,
                ],
                'timestamp' => 'Baru saja',
                'category' => $post->category,
                'content' => $post->content,
                'image' => $post->image_url,
                'likes' => 0,
                'comments' => 0,
                'isLiked' => false,
            ];

            // Return JSON response for AJAX requests
            return response()->json([
                'success' => true,
                'message' => 'Postingan berhasil dibuat!',
                'post' => $newPost
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat postingan. Silakan coba lagi.'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $post = CommunityPost::findOrFail($id);

            // Authorization
            if ($post->created_by !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki izin untuk mengedit postingan ini.'
                ], 403);
            }

            // Validasi
            $validated = $request->validate([
                'category' => 'required|string',
                'content' => 'required|string',
                'image' => 'nullable|string',
            ]);

            // Handle image upload
            $imagePath = $post->image;

            if ($request->has('image')) {
                if (empty($request->image)) {
                    if ($post->image) {
                        Storage::disk('public')->delete($post->image);
                    }
                    $imagePath = null;
                } elseif (preg_match('/^data:image\/(\w+);base64,/', $request->image)) {
                    if ($post->image) {
                        Storage::disk('public')->delete($post->image);
                    }

                    $image = $request->image;
                    preg_match('/^data:image\/(\w+);base64,/', $image, $type);
                    $image = substr($image, strpos($image, ',') + 1);
                    $type = strtolower($type[1]);

                    $image = base64_decode($image);
                    $imageName = Str::random(20) . '.' . $type;

                    Storage::disk('public')->put('community_posts/' . $imageName, $image);
                    $imagePath = 'community_posts/' . $imageName;
                }
            }

            // Update post
            $post->update([
                'content' => $validated['content'],
                'category' => $validated['category'],
                'image' => $imagePath,
            ]);

            $post->load('owned_by');
            $userId = auth()->id();

            $updatedPost = [
                'id' => $post->id,
                'author' => [
                    'id' => $post->owned_by->id,
                    'name' => $post->owned_by->name,
                    'avatar' => $post->owned_by->avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . $post->owned_by->name,
                ],
                'timestamp' => $post->created_at->diffForHumans(),
                'category' => $post->category,
                'content' => $post->content,
                'image' => $post->image_url,
                'likes' => $post->like_total,
                'comments' => $post->comments()->count(),
                'isLiked' => $post->isLikedBy($userId),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Postingan berhasil diperbarui!',
                'post' => $updatedPost
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui postingan. Silakan coba lagi.'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $post = CommunityPost::findOrFail($id);

            // Authorization
            if ($post->created_by !== auth()->id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki izin untuk menghapus postingan ini.'
                ], 403);
            }

            // Hapus gambar jika ada
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }

            // Hapus post
            $post->delete();

            return response()->json([
                'success' => true,
                'message' => 'Postingan berhasil dihapus!'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus postingan. Silakan coba lagi.'
            ], 500);
        }
    }

    public function toggleLike($postId)
    {
        try {
            $post = CommunityPost::findOrFail($postId);
            $userId = auth()->id();

            $like = CommunityLikes::where('post_id', $postId)
                                ->where('user_id', $userId)
                                ->first();

            if ($like) {
                $like->delete();
                $post->decrement('like_total');
                $isLiked = false;
                $message = 'Like dibatalkan';
            } else {
                CommunityLikes::create([
                    'post_id' => $postId,
                    'user_id' => $userId,
                ]);
                $post->increment('like_total');
                $isLiked = true;
                $message = 'Postingan disukai!';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'postId' => $postId,
                    'isLiked' => $isLiked,
                    'likeCount' => $post->like_total
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses like. Silakan coba lagi.'
            ], 500);
        }
    }

    public function storeComment(Request $request, $postId)
    {
        try {
            $validated = $request->validate([
                'content' => 'required|string|max:1000',
                'parent_id' => 'nullable|exists:community_comments,id'
            ]);

            $comment = CommunityComments::create([
                'post_id' => $postId,
                'user_id' => auth()->id(),
                'parent_id' => $validated['parent_id'] ?? null,
                'content' => $validated['content'],
            ]);

            $comment->load('user', 'replies');

            return response()->json([
                'success' => true,
                'message' => $validated['parent_id'] ? 'Balasan berhasil ditambahkan!' : 'Komentar berhasil ditambahkan!',
                'comment' => $comment
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menambahkan komentar. Silakan coba lagi.'
            ], 500);
        }
    }

    public function getComments($postId)
    {
        try {
            $comments = CommunityComments::with(['user', 'replies.user'])
                ->where('post_id', $postId)
                ->whereNull('parent_id')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($comment) {
                    return [
                        'id' => $comment->id,
                        'content' => $comment->content,
                        'user' => [
                            'name' => $comment->user->name,
                            'avatar' => $comment->user->avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . $comment->user->name,
                        ],
                        'created_at' => $comment->created_at->diffForHumans(),
                        'replies' => $comment->replies->map(function($reply) {
                            return [
                                'id' => $reply->id,
                                'content' => $reply->content,
                                'user' => [
                                    'name' => $reply->user->name,
                                    'avatar' => $reply->user->avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . $reply->user->name,
                                ],
                                'created_at' => $reply->created_at->diffForHumans(),
                            ];
                        })
                    ];
                });

            return response()->json($comments);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Gagal memuat komentar'
            ], 500);
        }
    }

    /**
     * Report a community post.
     */
    public function report(Request $request, $postId)
    {
        try {
            $post = CommunityPost::findOrFail($postId);
            $userId = auth()->id();

            // Check if already reported
            if ($post->isReportedBy($userId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda sudah melaporkan postingan ini sebelumnya.'
                ], 400);
            }

            $validated = $request->validate([
                'reason' => 'required|in:spam,inappropriate,harassment,misinformation,other',
                'description' => 'nullable|string|max:500',
            ]);

            CommunityReport::create([
                'post_id' => $postId,
                'user_id' => $userId,
                'reason' => $validated['reason'],
                'description' => $validated['description'] ?? null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Laporan berhasil dikirim. Terima kasih atas laporan Anda.'
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim laporan. Silakan coba lagi.'
            ], 500);
        }
    }

    /**
     * Toggle save/bookmark a post.
     */
    public function toggleSave($postId)
    {
        try {
            $post = CommunityPost::findOrFail($postId);
            $userId = auth()->id();

            $saved = CommunitySavedPost::where('post_id', $postId)
                                        ->where('user_id', $userId)
                                        ->first();

            if ($saved) {
                $saved->delete();
                $isSaved = false;
                $message = 'Postingan dihapus dari simpanan';
            } else {
                CommunitySavedPost::create([
                    'post_id' => $postId,
                    'user_id' => $userId,
                ]);
                $isSaved = true;
                $message = 'Postingan berhasil disimpan!';
            }

            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'postId' => (int) $postId,
                    'isSaved' => $isSaved,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan postingan. Silakan coba lagi.'
            ], 500);
        }
    }

    /**
     * Get user's saved posts.
     */
    public function savedPosts()
    {
        $userId = auth()->id();

        $savedPostIds = CommunitySavedPost::where('user_id', $userId)
            ->pluck('post_id');

        $posts = CommunityPost::with('owned_by')
            ->withCount('comments')
            ->whereIn('id', $savedPostIds)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($post) use ($userId) {
                return [
                    'id' => $post->id,
                    'author' => [
                        'id' => $post->owned_by->id,
                        'name' => $post->owned_by->name,
                        'avatar' => $post->owned_by->avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . $post->owned_by->name,
                    ],
                    'timestamp' => $post->created_at->diffForHumans(),
                    'category' => $post->category,
                    'content' => $post->content,
                    'image' => $post->image_url,
                    'likes' => $post->like_total,
                    'comments' => $post->comments_count,
                    'isLiked' => $post->isLikedBy($userId),
                    'isBookmarked' => true,
                ];
            });

        return Inertia::render('community/saved', [
            'savedPosts' => $posts
        ]);
    }
}