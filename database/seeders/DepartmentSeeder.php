<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = ['Engineering', 'Human Resources', 'Marketing', 'Sales', 'Design'];

        foreach ($departments as $dept) {
            Department::create([
                'name' => $dept,
                'slug' => Str::slug($dept),
            ]);
        }
    }
}
