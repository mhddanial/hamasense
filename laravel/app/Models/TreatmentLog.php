<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TreatmentLog extends Model
{
    protected $fillable = [
        'detection_id', 'outcome_note', 'treatment_note', 'action_taken'
    ];

    public function detection() {
        return $this->belongsTo(DetectionHistory::class, 'detection_id', 'id');
    }
}
