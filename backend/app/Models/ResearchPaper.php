<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Services\GoogleScholarService;

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
        'doi',
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

    // ============================================
    // RELATIONSHIPS
    // ============================================

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

    // ============================================
    // GOOGLE SCHOLAR METHODS
    // ============================================

    public function getScholarLinks(): array
    {
        $service = new GoogleScholarService();
        return $service->getScholarLinks($this->google_scholar_url, $this->title);
    }

    public function getGoogleScholarLinkAttribute(): ?string
    {
        if ($this->google_scholar_url) {
            return $this->google_scholar_url;
        }

        if ($this->title) {
            $service = new GoogleScholarService();
            return $service->generateSearchUrl($this->title);
        }

        return null;
    }

    public function getGoogleScholarSearchAttribute(): ?string
    {
        if ($this->title) {
            $service = new GoogleScholarService();
            return $service->generateSearchUrl($this->title);
        }
        return null;
    }

    public function hasExactScholarUrl(): bool
    {
        return !empty($this->google_scholar_url);
    }

    public function getDoiLinkAttribute(): ?string
    {
        if ($this->doi) {
            return 'https://doi.org/' . $this->doi;
        }
        return null;
    }

    // ============================================
    // SCOPES
    // ============================================

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

    /**
     * Search papers by title or abstract
     * (keywords and authors are relationships, not columns)
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'LIKE', "%{$search}%")
              ->orWhere('abstract', 'LIKE', "%{$search}%");
        });
    }

    public function scopeSearchExact($query, string $title)
    {
        return $query->where('title', '=', $title);
    }

    // ============================================
    // ACCESSORS
    // ============================================

    public function getFormattedAuthorsAttribute()
    {
        return $this->authors->pluck('full_name')->implode(', ');
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

    public function getScholarDataAttribute(): array
    {
        return $this->getScholarLinks();
    }
}