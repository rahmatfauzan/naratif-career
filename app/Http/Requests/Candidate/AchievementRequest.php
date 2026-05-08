<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;

class AchievementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'issuer' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'date' => ['nullable', 'date'],
            // Keamanan File Upload Sertifikat: Max 2MB, PDF/Gambar
            'file' => ['nullable', 'file', 'mimes:pdf,jpeg,png,jpg', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.mimes' => 'Format dokumen sertifikat harus PDF, JPEG, PNG, atau JPG.',
            'file.max' => 'Ukuran dokumen maksimal adalah 2MB.',
        ];
    }
}
