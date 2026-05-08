<?php

namespace App\Http\Requests\Candidate;

use Illuminate\Foundation\Http\FormRequest;

class CertificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'issuer' => ['nullable', 'string', 'max:255'],
            'credential_id' => ['nullable', 'string', 'max:255'],
            'credential_url' => ['nullable', 'url', 'max:255'],
            'issued_date' => ['nullable', 'date'],
            'expired_date' => ['nullable', 'date', 'after:issued_date'],
            // Keamanan File Upload Sertifikasi: Max 2MB, PDF/Gambar
            'file' => ['nullable', 'file', 'mimes:pdf,jpeg,png,jpg', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.mimes' => 'Format dokumen harus PDF, JPEG, PNG, atau JPG.',
            'file.max' => 'Ukuran dokumen maksimal adalah 2MB.',
        ];
    }
}
