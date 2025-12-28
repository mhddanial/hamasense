<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Disease extends Model
{
    protected $fillable = [
        'label', 'name', 'description', 'severity_level', 'plant_type_id', 'img_path'
    ];

    public function caused_by()
    {
        return $this->hasMany(PestCauseDisease::class, 'disease_id', 'id');
    }

    public function detection_history()
    {
        return $this->hasMany(DetectionHistory::class, 'disease_id', 'id');
    }

    public function plant_type()
    {
        return $this->belongsTo(PlantType::class, 'plant_type_id', 'id');
    }
}
