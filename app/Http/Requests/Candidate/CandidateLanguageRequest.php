<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;

class CandidateLanguageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Pastikan input berupa array
            'languages' => ['required', 'array'],
            
            // Validasi setiap item di dalam array
            'languages.*.language_id' => ['required', 'exists:languages,id'],
            'languages.*.proficiency' => ['nullable', 'string', 'in:Beginner,Conversational,Fluent,Native'],
        ];
    }

    public function messages(): array
    {
        return [
            'languages.required' => 'Daftar bahasa tidak boleh kosong.',
            'languages.*.language_id.exists' => 'Salah satu bahasa yang dipilih tidak valid.',
            'languages.*.proficiency.in' => 'Tingkat kemahiran harus berupa Beginner, Conversational, Fluent, atau Native.',
        ];
    }
}
