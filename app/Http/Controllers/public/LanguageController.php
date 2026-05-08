<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\Job\LanguageService;
use Illuminate\Http\Request;

class LanguageController extends Controller
{
    public function __construct(protected LanguageService $service) {}

    public function index(Request $request)
    {
        $search = $request->query('search');
        $languages = $this->service->getLanguages($search);

        return response()->json([
            'languages' => $languages
        ]);
    }
}
