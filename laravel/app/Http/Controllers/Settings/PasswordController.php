<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    /**
     * Show the user's password settings page.
     */
    public function edit(): Response
    {
        return Inertia::render('settings/password');
    }

    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        try {
            $user = $request->user();
            $isOAuthUser = !empty($user->google_id);
            $userHasPassword = !empty($user->password);
            $requireCurrentPassword = $userHasPassword && !$isOAuthUser;

            $rules = [
                'password' => ['required', 'confirmed', Password::defaults()],
            ];

            if ($requireCurrentPassword) {
                $rules['current_password'] = ['required', 'current_password'];
            }

            $validated = $request->validate($rules);
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);

            return back()->with('success', 'Kata sandi berhasil diperbarui'
            );
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return back()->with('error', 'Terjadi kesalahan saat memperbarui password. Silakan coba lagi.');
        }
    }
}
