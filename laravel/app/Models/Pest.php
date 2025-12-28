<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pest extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'scientific_name',
        'img_path',
        'category',
        'risk_level',
        'plant',
        'pencegahan',
        'penanganan',
    ];

    protected $casts = [
        'plant' => 'array',
        'pencegahan' => 'array',
        'penanganan' => 'array',
    ];

    // hubungan ini antara pest menyebabkan
    // penyakit ke tanaman
    public function causing()
    {
        return $this->hasMany(PestCauseDisease::class, 'pest_id', 'id');
    }

    public function plantTypes()
    {
        return $this->belongsToMany(PlantType::class, 'plant_type_pests', 'pest_id', 'plant_type_id');
    }
}
