<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pest extends Model
{
    protected $fillable = [
        'name',
        'description',
        'slug',
        'scientific_name',
        'img_path',
        // 'category',
        // 'risk_level'
    ];

    // hubungan ini antara pest menyebabkan
    // penyakit ke tanaman
    public function causing()
    {
        return $this->hasMany(PestCauseDisease::class, 'pest_id', 'id');
    }

    public function plant_type()
    {
        return $this->belongsToMany(PlantType::class, 'plant_type_pests', 'pest_id', 'plant_type_id');
    }

    public function images()
    {
        return $this->hasMany(PestImg::class, 'pest_id', 'id');
    }
}
