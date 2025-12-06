<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PestImg extends Model
{
    public $timestamps = false;
    protected $fillable = ['pest_id', 'filename'];
    protected $primaryKey = 'filename';
    protected $keyType = 'string';

    public function pest() 
    {
        return $this->belongsTo(Pest::class, 'pest_id', 'id');
    }
}
