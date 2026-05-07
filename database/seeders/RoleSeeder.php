<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role; // Asumsi menggunakan Spatie Permission

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::create(['name' => 'super-admin']);
        Role::create(['name' => 'hr-manager']);
        Role::create(['name' => 'interviewer']);
        Role::create(['name' => 'applicant']);
    }
}
