<?php

namespace App\Models;

use App\Enums\StageType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PipelineStage extends Model
{
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'type' => StageType::class,
            'is_final' => 'boolean',
        ];
    }

    public function pipeline(): BelongsTo
    {
        return $this->belongsTo(Pipeline::class);
    }

    public function criteria(): HasMany
    {
        return $this->hasMany(PipelineStageCriterion::class);
    }
}
