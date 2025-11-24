<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class CommunityPostController extends Controller
{
    public function index()
    {
        return Inertia::render('community/index');
    }
}
