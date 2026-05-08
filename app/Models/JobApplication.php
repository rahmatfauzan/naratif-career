<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class JobApplication extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'job_post_id',
        'candidate_id',
        'current_stage_id',
        'cv_document_id',
        'internal_notes',
        'match_score',
    ];

    public function jobPost()
    {
        return $this->belongsTo(JobPost::class);
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    // Assuming you have a PipelineStage model
    // public function currentStage()
    // {
    //     return $this->belongsTo(PipelineStage::class, 'current_stage_id');
    // }

    public function cvDocument()
    {
        return $this->belongsTo(CandidateDocument::class, 'cv_document_id');
    }

    public function answers()
    {
        return $this->hasMany(JobApplicationAnswer::class);
    }
}
