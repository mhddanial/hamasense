<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DetectionHistory extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'user_id',
        'image_path',
        'label',
        'confidence',
        'entropy',
        'should_abstain',
        'abstain_reasons',
        'info',
    ];

    protected $casts = [
        'abstain_reasons' => 'array',
        'info' => 'array',
        'should_abstain' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

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
