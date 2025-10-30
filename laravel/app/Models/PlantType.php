<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlantType extends Model
{
    protected $fillable = [
        'name'
    ];

    // lagi dibuat untuk model pic
    // public function pics ()
    // {
    //     return $this->hasMany();
    // }

    // fungsi di bawah ini hanya digunakan untuk memanggil plant 
    // yang dimiliki oleh suatu pengguna saja
    public function plants()
    {
        return $this->hasMany(Plant::class, 'plant_type_id', 'id');
    }

    public function disease()
    {
        return $this->hasMany(Disease::class, 'plant_type_id', 'id');
    }

    public function pest()
    {
        return $this->hasMany(PlantTypePest::class, 'plant_tpe_id', 'id');
    }
}
