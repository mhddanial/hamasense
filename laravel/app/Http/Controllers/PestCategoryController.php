<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\PestCategory;
use Illuminate\Support\Facades\DB;

class PestCategoryController extends Controller
{
    public function index()
    {
        $categories = PestCategory::all();

        return Inertia::render('admin/pest_category/index', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $field = $request->validate([
                'name' => 'required|string',
           ]);

            $pest_cat = PestCategory::create($field);

            DB::commit();
            return redirect()->back()->with('success', 'Kategori hama berhasil ditambahkan');
        } catch(\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menambahkan kategori hama: ' . $e->getMessage());
        }
    }

    public function update(Request $request, PestCategory $pest_category)
    {
        DB::beginTransaction();

        try {
            $field = $request->validate([
                'name' => 'required|string',
            ]);

            $pest_category->update($field);

            DB::commit();
            return redirect()->back()->with('success', 'Kategori hama berhasil diperbarui');
        } catch(\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal memperbarui kategori hama: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, PestCategory $pest_category)
    {
        DB::beginTransaction();

        try {
            $pest_category->delete();
            DB::commit();

            return redirect()->back()->with('success', 'Kategori hama berhasil dihapus');
        } catch(\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', 'Gagal menghapus kategori hama: ' . $e->getMessage());
        }
    }
}
