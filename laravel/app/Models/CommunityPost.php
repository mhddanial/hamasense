<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommunityPost extends Model
{
    protected $fillable = [
        'title',
        'content',
        'category',
        'image',
        'like_total',
        'created_by'
    ];

    // TAMBAH INI
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return null;
    }

    public function owned_by()
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    public function plant()
    {
        return $this->hasMany(PlantPost::class, 'plant_id', 'id');
    }
        // Relasi ke Likes
    public function likes()
    {
        return $this->hasMany(CommunityLikes::class, 'post_id');
    }

    // Relasi ke Comments (hanya parent comment, bukan reply)
    public function comments()
    {
        return $this->hasMany(CommunityComments::class, 'post_id')
                    ->whereNull('parent_id'); // hanya ambil comment utama
    }

    // Semua comments termasuk replies
    public function allComments()
    {
        return $this->hasMany(CommunityComments::class, 'post_id');
    }

    // Cek apakah user sudah like post ini
    public function isLikedBy($userId)
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }

    // Relasi ke Reports
    public function reports()
    {
        return $this->hasMany(CommunityReport::class, 'post_id');
    }

    // Relasi ke Saved Posts
    public function savedBy()
    {
        return $this->hasMany(CommunitySavedPost::class, 'post_id');
    }

    // Cek apakah post disimpan oleh user
    public function isSavedBy($userId)
    {
        return $this->savedBy()->where('user_id', $userId)->exists();
    }

    // Cek apakah post sudah dilaporkan oleh user
    public function isReportedBy($userId)
    {
        return $this->reports()->where('user_id', $userId)->exists();
    }
}