<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class PublicSearchController extends Controller
{
    public function index()
    {
        return Inertia::render('Public/Home', [
            'refugees' => [],
            'shelters' => [],
            'total' => 0,
        ]);
    }
}
