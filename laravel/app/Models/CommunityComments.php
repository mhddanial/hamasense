<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityComments extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'user_id',
        'parent_id',
        'content',
    ];

    /**
     * Get the user that owns the comment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the post that the comment belongs to.
     */
    public function post()
    {
        return $this->belongsTo(CommunityPost::class);
    }

    /**
     * Get the parent comment (for nested replies).
     */
    public function parent()
    {
        return $this->belongsTo(CommunityComments::class, 'parent_id');
    }

    /**
     * Get the replies to this comment.
     */
    public function replies()
    {
        return $this->hasMany(CommunityComments::class, 'parent_id');
    }

}