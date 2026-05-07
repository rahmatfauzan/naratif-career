<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    protected $table = 'educations';
    protected $guarded = ['id'];

    protected $casts = [
        'gpa' => 'float',
        'max_gpa' => 'float',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
