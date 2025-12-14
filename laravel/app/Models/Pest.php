<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pest extends Model
{
    protected $fillable = [
        'name', 'description', 'scientific_name', 'img_path'
    ];

    // hubungan ini antara pest menyebabkan
    // penyakit ke tanaman
    public function causing()
    {
        return $this->hasMany(PestCauseDisease::class, 'pest_id', 'id');
    }

    public function plant_like()
    {
        return $this->hasMany(PlantTypePest::class, 'pest_id' , 'id');
    }
}