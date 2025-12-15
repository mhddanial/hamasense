<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\CommunityPost;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CommunityPostController extends Controller
{
    public function index()
    {
        $posts = CommunityPost::with('owned_by')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($post) {
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
                    'comments' => 0,
                    'isLiked' => false,
                    'isBookmarked' => false,
                ];
            });

        return Inertia::render('community/index', [
            'initialPosts' => $posts
        ]);
    }

    public function store(Request $request)
    {
        // Validasi
        $validated = $request->validate([
            'category' => 'required|string',
            'content' => 'required|string',
            'image' => 'nullable|string', // base64 image
        ]);

        // Handle image upload jika ada
        $imagePath = null;
        if ($request->image) {
            // Decode base64
            $image = $request->image;
            if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
                $image = substr($image, strpos($image, ',') + 1);
                $type = strtolower($type[1]); // jpg, png, gif

                $image = base64_decode($image);
                $imageName = Str::random(20) . '.' . $type;

                // Simpan ke storage/app/public/community_posts
                Storage::disk('public')->put('community_posts/' . $imageName, $image);
                $imagePath = 'community_posts/' . $imageName;
            }
        }

        // Simpan post
        $post = CommunityPost::create([
            'title' => '', // kosongkan dulu atau isi dari content
            'content' => $validated['content'],
            'category' => $validated['category'],
            'image' => $imagePath,
            'like_total' => 0,
            'created_by' => auth()->id(),
        ]);

        // Load relasi untuk return
        $post->load('owned_by');

        // Return data post baru dalam format yang sama
        return Inertia::render('community/index')->with('newPost', [
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
            'isBookmarked' => false,
            'success' => 'Postingan berhasil dibuat.',
        ]);
    }

    public function update(Request $request, $id)
    {
        $post = CommunityPost::findOrFail($id);

        // Authorization: pastikan user adalah pemilik post
        if ($post->created_by !== auth()->id()) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        // Validasi
        $validated = $request->validate([
            'category' => 'required|string',
            'content' => 'required|string',
            'image' => 'nullable|string', // base64 image
        ]);

        // Handle image upload jika ada perubahan
        $imagePath = $post->image;

        if ($request->has('image')) {
            // Jika image kosong, hapus gambar lama
            if (empty($request->image)) {
                if ($post->image) {
                    Storage::disk('public')->delete($post->image);
                }
                $imagePath = null;
            }
            // Jika ada gambar baru (base64)
            elseif (preg_match('/^data:image\/(\w+);base64,/', $request->image)) {
                // Hapus gambar lama jika ada
                if ($post->image) {
                    Storage::disk('public')->delete($post->image);
                }

                // Upload gambar baru
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

        // Load relasi
        $post->load('owned_by');

        // Return updated post
        return back()->with('updatedPost', [
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
            'comments' => 0,
            'isLiked' => false,
            'isBookmarked' => false,
        ]);
    }

    public function destroy($id)
    {
        $post = CommunityPost::findOrFail($id);

        // Authorization: pastikan user adalah pemilik post
        if ($post->created_by !== auth()->id()) {
            return back()->withErrors(['error' => 'Unauthorized']);
        }

        // Hapus gambar jika ada
        if ($post->image) {
            Storage::disk('public')->delete($post->image);
        }

        // Hapus post
        $post->delete();

        return back()->with('success', 'Postingan berhasil dihapus');
    }
}