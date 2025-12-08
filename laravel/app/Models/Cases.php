<?php

namespace App\Models;

use App\Models\CaseLog;
use App\Models\CaseAction;
use App\Models\CaseFollowUp;
use App\Models\ScheduledCheck;
use App\Models\DetectionHistory;
use Illuminate\Database\Eloquent\Model;

class Cases extends Model
{
    protected $table = 'cases';

    protected $fillable = [
        'user_id',
        'detection_history_id',
        'plant_name',
        'pest_name',
        'label',
        'image_path',
        'recommended_treatment',
        'status',
        'confidence',
        'entropy',
        'ai_summary',
    ];

    public function detectionHistory()
    {
        return $this->belongsTo(DetectionHistory::class);
    }

    public function logs()
    {
        return $this->hasMany(CaseLog::class, 'case_id');
    }

    public function actions()
    {
        return $this->hasMany(CaseAction::class, 'case_id');
    }

    public function ScheduledCheck()
    {
        return $this->hasMany(ScheduledCheck::class, 'case_id');
    }

    public function FollowUp()
    {
        return $this->hasMany(CaseFollowUp::class, 'case_id');
    }
};
