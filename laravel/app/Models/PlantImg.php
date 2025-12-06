<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlantImg extends Model
{
    public $timestamps = false;
    protected $fillable = ['plant_id', 'filename'];
    protected $primaryKey = 'filename';
    protected $keyType = 'string';

    public function plant() 
    {
        return $this->belongsTo(PlantType::class, 'plant_id', 'id');
    }
}
