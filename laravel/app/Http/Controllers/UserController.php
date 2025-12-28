<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $keyword = $request->query('keyword');
        
        $users = User::query()
            ->when($keyword, function ($query, $keyword) {
                $search_term = "%{$keyword}%";
                return $query->where(function ($q) use ($search_term) {
                    $q->where('name', 'like', $search_term)
                        ->orWhere('email', 'like', $search_term);
                });
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'search' => $keyword
        ]);
    }

    public function destroy(Request $request, User $user)
    {
        DB::beginTransaction();
        
        try {
            // Prevent deleting self
            if ($user->id === $request->user()->id) {
                return redirect()->back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri!');
            }

            $user->delete();
            DB::commit();

            return redirect()->back()->with('success', 'Pengguna berhasil dihapus!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menghapus pengguna: ' . $e->getMessage());
        }
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,customer'
        ]);

        // Prevent changing own role
        if ($user->id === $request->user()->id) {
            return redirect()->back()->with('error', 'Anda tidak dapat mengubah role Anda sendiri!');
        }

        $user->update(['role' => $request->role]);

        return redirect()->back()->with('success', 'Role pengguna berhasil diubah!');
    }
}
