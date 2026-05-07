<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    use SoftDeletes;

    protected $guarded = ['id'];

    public function jobPosts(): HasMany
    {
        return $this->hasMany(JobPost::class);
    }
}
