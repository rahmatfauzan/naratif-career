<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;

class CandidateSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Pastikan input berupa array
            'skills' => ['required', 'array'],

            // Validasi setiap item di dalam array
            'skills.*.skill_id' => ['required', 'exists:skills,id'],
            'skills.*.level' => [
                'nullable',
                'string',
                'in:beginner,intermediate,expert,master',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'skills.required' => 'Daftar keahlian tidak boleh kosong.',
            'skills.*.skill_id.exists' => 'Salah satu keahlian yang dipilih tidak valid.',
            'skills.*.level.in' => 'Level keahlian harus berupa Beginner, Intermediate, Advanced, atau Expert.',
        ];
    }
}
