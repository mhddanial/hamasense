<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlantTypePest extends Model
{
    protected $primaryKey = ['plant_type_id', 'pest_id'];
    protected $fillable = [
        'plant_type_id', 'pest_id'
    ];
    public $timestamps = false;

    public function plant_type()
    {
        return $this->belongsTo(PlantType::class, 'plant_type_id', 'id');
    }

    public function pest()
    {
        return $this->belongsTo(Pest::class, 'pest_id', 'id');
    }
}
