<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlantPost extends Model
{
    protected $primaryKey = ['post_id', 'plant_id'];
    public $timestamps = false;
    protected $fillable = [
        'post_id', 'plant_id'
    ];

    public function post()
    {
        return $this->hasMany(CommunityPost::class, 'post_id', 'plant_id');
    }

    public function plant()
    {
        return $this->hasMany(Plant::class, 'plant_id', 'id');
    }
}
