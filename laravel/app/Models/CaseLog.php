<?php

namespace App\Models;

use App\Models\CaseModel;
use Illuminate\Database\Eloquent\Model;

class CaseLog extends Model
{
    protected $fillable = [
        'case_id',
        'conditional_note',
        'image_path',
    ];

    public function Case()
    {
        return $this->belongsTo(CaseModel::class, 'case_id');
    }
}
