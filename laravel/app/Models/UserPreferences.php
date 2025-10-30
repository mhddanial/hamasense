<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreferences extends Model
{
    protected $primaryKey = ['user_id'];
    public $timestamps = false;

    protected $fillable = [
        'user_id', 'default_location', 'notification_enabled'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

}
