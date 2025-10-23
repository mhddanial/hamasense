<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plant extends Model
{
    protected $fillable = [
        'name', 'status', 'location', 'plant_type_id', 'owned_by'
    ];

    public function plant_type()
    {
        return $this->belongsTo(PlantType::class, 'plant_type_id', 'id');
    }
    
    public function owner()
    {
        return $this->belongsTo(User::class, 'users', 'id');
    }
}
