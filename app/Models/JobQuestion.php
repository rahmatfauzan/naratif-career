<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobQuestion extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_post_id',
        'question',
        'type',
        'options',
        'is_required',
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean',
    ];

    public function jobPost()
    {
        return $this->belongsTo(JobPost::class);
    }

    public function answers()
    {
        return $this->hasMany(JobApplicationAnswer::class);
    }
}
