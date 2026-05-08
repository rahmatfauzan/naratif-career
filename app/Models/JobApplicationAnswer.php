<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplicationAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_application_id',
        'job_question_id',
        'answer_text',
        'candidate_document_id',
    ];

    public function application()
    {
        return $this->belongsTo(JobApplication::class, 'job_application_id');
    }

    public function question()
    {
        return $this->belongsTo(JobQuestion::class, 'job_question_id');
    }

    public function document()
    {
        return $this->belongsTo(CandidateDocument::class, 'candidate_document_id');
    }
}
