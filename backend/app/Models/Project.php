<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'research_area_id',
        'supervisor_id',
        'created_by',
        'start_date',
        'deadline',
        'status',
        'progress_pct',
        'is_public',
        'completed_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'deadline' => 'date',
        'progress_pct' => 'integer',
        'is_public' => 'boolean',
        'completed_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'planning',
        'progress_pct' => 0,
        'is_public' => false,
    ];

    // Relationships
    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function researchArea()
    {
        return $this->belongsTo(ResearchArea::class);
    }

    public function members()
    {
        return $this->hasMany(ProjectMember::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'project_members');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function files()
    {
        return $this->hasMany(File::class);
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'entity');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['planning', 'in_progress']);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    // Accessors
    public function getStatusColorAttribute()
    {
        $colors = [
            'planning' => 'blue',
            'in_progress' => 'yellow',
            'completed' => 'green',
            'archived' => 'gray',
        ];
        return $colors[$this->status] ?? 'gray';
    }

    public function getProgressAttribute()
    {
        return $this->progress_pct;
    }
}