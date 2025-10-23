<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PestCauseDisease extends Model
{
    protected $primaryKey = ['pest_id', 'disease_id'];
    protected $fillable = [
        'pest_id', 'disease_id'
    ];
    public $timestamps = false;

    public function pest() 
    {
        return $this->belongsTo(Pest::class, 'pest_id', 'id');
    }

    public function disease()
    {
        return $this->belongsTo(Disease::class, 'disease_id', 'id');
    }
}
