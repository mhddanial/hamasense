<?php

namespace App\Models;

use App\Models\CaseModel;
use Illuminate\Database\Eloquent\Model;

class CaseFollowUp extends Model
{
    protected $fillable = [
        'case_id',
        'image_path',
        'ai_label',
        'ai_confidence',
        'ai_info',
        'comparison_result',
    ];

    public function Case()
    {
        return $this->belongsTo(CaseModel::class, 'case_id');
    }
}
