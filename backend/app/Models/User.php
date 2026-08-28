<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'full_name',
        'institution',
        'email',
        'password_hash',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password_hash' => 'hashed',
        ];
    }

    /**
     * Tell Laravel which database column contains the user's password.
     */
    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    /**
     * Research areas selected by the user.
     */
    public function researchAreas(): BelongsToMany
    {
        return $this->belongsToMany(
            ResearchArea::class,
            'user_research_areas'
        );
    }

    /**
     * The user's role verification request.
     */
    public function roleVerification()
    {
        return $this->hasOne(RoleVerification::class);
    }
}