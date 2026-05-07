<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CandidateLanguage extends Pivot
{
    // Beri tahu Laravel nama tabelnya secara eksplisit
    protected $table = 'candidate_languages';

    // Jika kamu ingin menambahkan relasi tambahan atau custom logic di pivot ini,
    // bisa ditulis di sini. Misalnya:
    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }

    public function language()
    {
        return $this->belongsTo(Language::class);
    }
}
