<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
    ];

    /**
     * Get all posts in this category
     */
    public function posts()
    {
        return $this->hasMany(CommunityPost::class, 'category', 'slug');
    }
}
