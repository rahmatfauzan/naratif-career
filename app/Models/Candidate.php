<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'date_of_birth' => 'date',
        'status' => 'string', // 'active', 'hired', 'rejected'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function defaultCv()
    {
        return $this->belongsTo(CandidateDocument::class, 'default_cv_id');
    }

    public function documents()
    {
        return $this->hasMany(CandidateDocument::class);
    }

    public function address()
    {
        return $this->hasOne(CandidateAddress::class);
    }

    public function educations()
    {
        return $this->hasMany(Education::class);
    }

    public function experiences()
    {
        return $this->hasMany(Experience::class);
    }

    public function achievements()
    {
        return $this->hasMany(Achievement::class);
    }

    public function trainings()
    {
        return $this->hasMany(Training::class);
    }

    public function certifications()
    {
        return $this->hasMany(Certification::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'candidate_skills')
            ->withPivot('level')
            ->withTimestamps();
    }

    public function languages()
    {
        return $this->belongsToMany(Language::class, 'candidate_languages')
            ->withPivot('proficiency')
            ->withTimestamps();
    }
}
