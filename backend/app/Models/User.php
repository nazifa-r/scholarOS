<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'full_name',
        'email',
        'password_hash',
        'role_id',
        'department_id',
        'institution',
        'bio',
        'research_interests',
        'skills',
        'profile_picture',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
    ];

    // Relationships
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'created_by');
    }

    public function supervisedProjects()
    {
        return $this->hasMany(Project::class, 'supervisor_id');
    }

    public function projectMemberships()
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class, 'assigned_to');
    }

    public function papers()
    {
        return $this->hasMany(ResearchPaper::class, 'uploaded_by');
    }

    public function authoredPapers()
    {
        return $this->belongsToMany(ResearchPaper::class, 'paper_authors');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function followers()
    {
        return $this->belongsToMany(User::class, 'followers', 'followed_id', 'follower_id');
    }

    public function following()
    {
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'followed_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    // Helper methods
    public function isAdmin(): bool
    {
        return $this->role->name === 'sys_admin';
    }

    public function isFaculty(): bool
    {
        return $this->role->name === 'faculty';
    }

    public function isStudent(): bool
    {
        return $this->role->name === 'student';
    }

    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}