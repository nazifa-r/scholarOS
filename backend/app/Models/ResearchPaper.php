<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ResearchPaper extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'abstract',
        'keywords',
        'research_area',
        'category',
        'authors',
        'google_scholar_url',
        'publication_status',
        'category_id',
        'research_area_id',
        'uploaded_by',
        'verified_by',
        'publication_year',
        'pdf_path',
        'pdf_filename',
        'file_size',
        'status',
        'is_verified',
        'views',
        'downloads',
        'verified_at',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
        'publication_year' => 'integer',
        'file_size' => 'integer',
        'views' => 'integer',
        'downloads' => 'integer',
    ];

    protected $attributes = [
        'status' => 'pending',
        'is_verified' => false,
        'views' => 0,
        'downloads' => 0,
    ];

    // Comment out ALL relationships for now
    /*
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function researchArea()
    {
        return $this->belongsTo(ResearchArea::class);
    }

    public function uploadedBy()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function keywords()
    {
        return $this->belongsToMany(Keyword::class, 'paper_keywords');
    }

    public function authors()
    {
        return $this->belongsToMany(User::class, 'paper_authors');
    }

    public function comments()
    {
        return $this->morphMany(Comment::class, 'entity');
    }

    public function bookmarks()
    {
        return $this->morphMany(Bookmark::class, 'entity');
    }

    public function versions()
    {
        return $this->hasMany(PaperVersion::class);
    }
    */

    // Keep these - they don't need other models
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function getFormattedAuthorsAttribute()
    {
        return $this->authors; // Simplified for now
    }

    public function getStatusBadgeAttribute()
    {
        $badges = [
            'pending' => 'warning',
            'approved' => 'success',
            'rejected' => 'danger',
            'withdrawn' => 'secondary',
        ];
        return $badges[$this->status] ?? 'secondary';
    }
}