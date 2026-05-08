<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;

class EducationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'school_name' => ['required', 'string', 'max:255'],
            'degree' => ['nullable', 'string', 'in:TK,SD,SMP,SMA,SMK,D1,D2,D3,D4,S1,S2,S3'],
            'field_of_study' => ['nullable', 'string', 'max:255'],
            'start_year' => ['nullable', 'integer', 'min:1900', 'max:' . (date('Y') + 10)],
            'end_year' => ['nullable', 'integer', 'min:1900', 'max:' . (date('Y') + 10), 'gte:start_year'],
            'gpa' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'max_gpa' => ['nullable', 'numeric', 'min:0', 'max:100', 'gte:gpa'],
        ];
    }
}
