<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidateDocument extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function experiences()
    {
        return $this->hasMany(Experience::class, 'document_id');
    }

    public function certifications()
    {
        return $this->hasMany(Certification::class, 'document_id');
    }

    public function trainings()
    {
        return $this->hasMany(Training::class, 'document_id');
    }

    public function achievements()
    {
        return $this->hasMany(Achievement::class, 'document_id');
    }
}