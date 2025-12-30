<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PestCategory extends Model
{
    protected $fillable = [
        'name'
    ];

    public function pests()
    {
        return $this->hasMany(Pest::class, 'category', 'name');
    }
}
