<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title', 
        'slug',
        'content', 
        'writer_id', 
        'category_id',
        'image',
        // 'tags',
        // 'summary',
        // 'status',
        // 'published_at',
        // 'views_count',
        // 'estimated_read_time'
    ];

    protected $casts = [
        // 'tags' => 'array',
        // 'published_at' => 'datetime',
    ];

    public function writer()
    {
        return $this->belongsTo(User::class, 'writer_id', 'id');
    }

    public function category()
    {
        return $this->belongsTo(ArticleCategory::class, 'category_id', 'id');
    }

    public function relatedArticles()
    {
        return $this->belongsToMany(Article::class, 'article_relations', 'article_id', 'related_article_id');
    }
}
