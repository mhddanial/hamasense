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
}