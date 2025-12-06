<?php

namespace App\Models;

use App\Models\CaseModel;
use Illuminate\Database\Eloquent\Model;

class CaseAction extends Model
{
    protected $fillable = [
        'case_id',
        'action_type',
        'description',
        'performed_at',
    ];

    public function Case()
    {
        return $this->belongsTo(CaseModel::class, 'case_id');
    }
}
