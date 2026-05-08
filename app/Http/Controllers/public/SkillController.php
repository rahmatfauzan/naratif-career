<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\Job\SkillService;
use Illuminate\Http\Request; // Tambahkan ini

class SkillController extends Controller
{
    public function index(Request $request, SkillService $skillService)
    {
        // Tangkap query pencarian dari React
        $search = $request->query('search');

        return response()->json([
            'skills' => $skillService->getSkills($search)
        ]);
    }
}
