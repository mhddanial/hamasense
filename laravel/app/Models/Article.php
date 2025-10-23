<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'title', 'content', 'writer_id', 'category_id'
    ];

    public function writer()
    {
        return $this->belongsTo(User::class, 'writer_id', 'id');
    }

    // tambahi like juga nanti
    public function category()
    {
        return $this->belongsTo(ArticleCategory::class, 'category_id', 'id');
    }
}
