<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'issued_date' => 'date',
        'expired_date' => 'date',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function document()
    {
        return $this->belongsTo(CandidateDocument::class, 'document_id');
    }
}