<?php
// routes/web.php

use Illuminate\Support\Facades\Route;

Route::get('/api/wilayah/{type}/{code?}', function ($type, $code = null) {
    $base = 'https://wilayah.id/api';

    $url = match ($type) {
        'provinces' => "$base/provinces.json",
        'regencies' => "$base/regencies/$code.json",
        'districts' => "$base/districts/$code.json",
        'villages' => "$base/villages/$code.json",
        default => abort(404),
    };

    return response()->json(
        json_decode(file_get_contents($url), true)
    );
});
