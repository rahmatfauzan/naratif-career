<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    // Relasi untuk menarik file bukti paklaring
    public function document()
    {
        return $this->belongsTo(CandidateDocument::class, 'document_id');
    }
}
