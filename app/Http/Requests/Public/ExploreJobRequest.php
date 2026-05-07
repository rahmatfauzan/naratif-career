<?php

namespace App\Http\Requests\Public;

use App\Enums\JobLocation;
use App\Enums\JobType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class ExploreJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Ubah jadi true agar semua pengunjung publik bisa mengaksesnya
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'search'        => ['nullable', 'string', 'max:100'],
            'department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'skill_id'      => ['nullable', 'regex:/^\d+(,\d+)*$/'],
            'type'          => ['nullable', new Enum(JobType::class)],
            'location'      => ['nullable', new Enum(JobLocation::class)],
            'sort'          => ['nullable', 'string'],
        ];
    }
}
