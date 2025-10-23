<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleCategory extends Model
{
    protected $fillable = [
        'name'
    ];

    public function article()
    {
        return $this->hasMany(ArticleCategory::class, 'category_id', 'id'); 
    }
}
