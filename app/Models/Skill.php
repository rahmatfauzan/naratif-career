<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Skill extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Auto-generate slug
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($skill) {
            if (empty($skill->slug)) {
                $skill->slug = Str::slug($skill->name);
            }
        });
    }

    // Relasi ke JobPost (Kode aslimu)
    public function jobPosts(): BelongsToMany
    {
        return $this->belongsToMany(JobPost::class, 'job_skills')
            ->using(JobSkill::class)
            ->withTimestamps();
    }

    // Relasi ke Candidate (Tambahan baru)
    // Menggunakan ->using() agar Laravel tahu kita pakai Pivot Model khusus
    public function candidates(): BelongsToMany
    {
        return $this->belongsToMany(Candidate::class, 'candidate_skills')
            ->using(CandidateSkill::class) // Menyambungkan ke Pivot Model
            ->withPivot('level')
            ->withTimestamps();
    }
}
