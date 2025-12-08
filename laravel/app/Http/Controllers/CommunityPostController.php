<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
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
    return back()->with('newPost', [
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
    ]);
}
}
