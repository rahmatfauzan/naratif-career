<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreJobApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->candidate !== null;
    }

    public function rules(): array
    {
        return [
            'cv_document_id' => ['required', 'exists:candidate_documents,id'],
            'cover_letter' => ['nullable', 'string', 'max:5000'],
            'answers' => ['nullable', 'array'],
            'answers.*.job_question_id' => ['required_with:answers', 'exists:job_questions,id'],
            'answers.*.answer_text' => ['nullable', 'string'],
            'answers.*.file' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'], // 5MB max
        ];
    }
}
