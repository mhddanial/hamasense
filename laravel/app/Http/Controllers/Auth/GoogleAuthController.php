<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Exception;
use Illuminate\Support\Facades\Log;

class GoogleAuthController extends Controller
{
    // Redirect to Google for authentication
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    // Handle callback from Google
    public function callback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            $user = User::where('google_id', $googleUser->getId())->first();

            if ($user) {
                Auth::login($user, true);
                return redirect()->intended('dashboard');
            }
            
            $existingUser = User::where('email', $googleUser->getEmail())->first();

            if ($existingUser) {
                $existingUser->update([
                    'google_id' => $googleUser->getId(),
                ]);
                Auth::login($existingUser, true);
            } else {
                $newUser = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'email_verified_at' => now(),
                    'password' => Hash::make(Str::random(24)),
                    'avatar' => $googleUser->getAvatar(),
                ]);
                Auth::login($newUser, true);
            }

            return redirect()->intended('dashboard');

        } catch (Exception $e) {
            Log::error('Google Auth Error: '.$e->getMessage());
            return redirect(route('login'))->withErrors(['google' => 'Gagal terhubung dengan Google. Silakan coba lagi.']);
        }
    }
}