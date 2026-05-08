<?php

namespace App\Models;

use App\Enums\JobType;
use App\Enums\JobStatus;
use App\Enums\JobLocation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class JobPost extends Model
{
    use SoftDeletes, HasFactory;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'type' => JobType::class,
            'location' => JobLocation::class,
            'status' => JobStatus::class,

            // Casting tipe data JSONB menjadi array secara otomatis
            'description' => 'array',
            'nice_to_have' => 'array',
            'requirements' => 'array',
            'benefits' => 'array',

            'deadline' => 'date',
        ];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function pipeline(): BelongsTo
    {
        return $this->belongsTo(Pipeline::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'job_skills')
                    ->using(JobSkill::class)
                    ->withTimestamps();
    }

    public function jobQuestions()
    {
        return $this->hasMany(JobQuestion::class);
    }
}
