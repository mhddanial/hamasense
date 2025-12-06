<?php

namespace App\Models;

use App\Models\CaseModel;
use Illuminate\Database\Eloquent\Model;

class ScheduledCheck extends Model
{
    protected $fillable = [
        'case_id',
        'check_type',
        'scheduled_at',
        'notification_enabled',
        'status',
    ];

    public function Case()
    {
        return $this->belongsTo(CaseModel::class, 'case_id');
    }
}
