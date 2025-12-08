<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ArticleImg extends Model
{
    public $timestamps = false;
    protected $fillable = ['article_id', 'filename'];
    protected $primaryKey = 'filename';
    protected $keyType = 'string';

    public function article() 
    {
        return $this->belongsTo(Article::class, 'article_id', 'id');
    }
}
