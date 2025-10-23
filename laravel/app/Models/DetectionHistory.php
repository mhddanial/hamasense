<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetectionHistory extends Model
{
    protected $fillable = [
        'plant_id', 'confindence', 'image_path', 'disease_id'
    ];

    public function plant()
    {
        return $this->belongsTo(Plant::class, 'plant_id', 'id');
    }

    public function disease()
    {
        return $this->belongsTo(Disease::class, 'disease_id', 'id');
    }

    public function treatment_log()
    {
        return $this->hasMany(TreatmentLog::class, 'detection_id', 'id');
    }
}
