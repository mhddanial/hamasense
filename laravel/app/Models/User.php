<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
        'avatar',
        'google_id',
        'role',
        'location_lat',
        'location_lon',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['avatar_url'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getPasswordSetAttribute()
    {
        // OAuth users (with google_id) might have a random password hash they don't know
        // So we consider them as not having a password set
        if (!empty($this->google_id)) {
            return false;
        }
        
        return !empty($this->password);
    }

    public function getAvatarUrlAttribute()
    {
        if (!$this->avatar) {
            return asset('default-avatar.png');
        }

        // Jika avatar sudah berupa URL (misal dari Google)
        if (Str::startsWith($this->avatar, ['http://', 'https://'])) {
            return $this->avatar;
        }

        // Jika avatar berasal dari storage
        return asset('storage/' . $this->avatar);
    }
}
