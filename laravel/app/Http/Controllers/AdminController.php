<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard () 
    {
        return Inertia::render('admin/dashboard');
    }

    public function user()
    {
        return response()->json([
            'users'=> User::all(),
            'logged_in' => Auth::user()
        ]);
    }
}
