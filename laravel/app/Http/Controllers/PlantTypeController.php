<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use App\Models\Pest;
use App\Models\PlantType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PlantTypeController extends Controller
{
    public function index(Request $request)
    {
        $keyword = $request->query('keyword');
        $sortBy = $request->query('sort', 'latest');
        
        $plants = PlantType::query()
            ->when($keyword, function ($query, $keyword) {
                $search_term = "{$keyword}%";
                return $query->where(function ($q) use ($search_term) {
                    $q->where('name', 'like', $search_term)
                        ->orWhere('scientific_name',  'like', $search_term);
                });
            });

        // Apply sorting
        switch ($sortBy) {
            case 'oldest':
                $plants->oldest();
                break;
            case 'name_asc':
                $plants->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $plants->orderBy('name', 'desc');
                break;
            default:
                $plants->latest();
                break;
        }

        $plants = $plants->paginate(10);

        return Inertia::render('admin/plant/index', [
            'plants' => $plants,
            'filters' => [
                'keyword' => $keyword,
                'sort' => $sortBy
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/plant/create', [
            'pests' => Pest::select('id', 'name', 'slug')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'scientific_name' => 'required|string|max:255',
            'detail' => 'required|string',
            'img_path' => 'nullable|image|max:2048',
            'slug' => 'nullable|string|max:255|unique:plant_types,slug',
            'pests' => 'nullable|array',
            'pests.*' => 'integer|exists:pests,id'
        ]);

        DB::beginTransaction();

        try {
            // Auto-generate slug if not provided
            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
            }

            // Handle image upload
            if ($request->hasFile('img_path')) {
                $file = $request->file('img_path');
                $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('plant', $fileName, 'public');
                $validated['img_path'] = $fileName;
            }

            $plantType = PlantType::create([
                'name' => $validated['name'],
                'scientific_name' => $validated['scientific_name'],
                'detail' => $validated['detail'],
                'slug' => $validated['slug'],
                'img_path' => $validated['img_path'] ?? null,
            ]);

            // Sync pest relationships if provided
            if (!empty($validated['pests'])) {
                $plantType->pest()->sync($validated['pests']);
            }

            DB::commit();

            return redirect('admin/plant')->with('success', 'Jenis tanaman berhasil ditambahkan!');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect('admin/plant')->with('error', 'Gagal menambahkan jenis tanaman: ' . $e->getMessage());
        }
    }

    public function show(Request $request, PlantType $plant)
    {
        return Inertia::render('admin/plant/show', [
            'plant' => $plant->load('pest:id,name,slug'),
            'pests' => Pest::select('id', 'name', 'slug')->get(),
            'diseases' => Disease::select('id', 'name', 'label')->get()
        ]);
    }

    public function update(Request $request, PlantType $plant)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'scientific_name' => 'required|string|max:255',
            'detail' => 'required|string',
            'new_img' => 'nullable|image|max:2048',
            'slug' => 'nullable|string|max:255|unique:plant_types,slug,' . $plant->id,
            'pests' => 'nullable|array',
            'pests.*' => 'integer|exists:pests,id'
        ]);

        DB::beginTransaction();

        try {
            // Auto-generate slug if not provided
            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
            }

            // Handle new image upload
            if ($request->hasFile('new_img')) {
                // Delete old image if exists
                if ($plant->img_path) {
                    Storage::disk('public')->delete('plant/' . $plant->img_path);
                }
                $file = $request->file('new_img');
                $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('plant', $fileName, 'public');
                $validated['img_path'] = $fileName;
            }

            $plant->update([
                'name' => $validated['name'],
                'scientific_name' => $validated['scientific_name'],
                'detail' => $validated['detail'],
                'slug' => $validated['slug'],
                'img_path' => $validated['img_path'] ?? $plant->img_path,
            ]);

            // Sync pest relationships
            if (isset($validated['pests'])) {
                $plant->pest()->sync($validated['pests']);
            }

            DB::commit();

            return redirect('/admin/plant')->with('success', 'Berhasil mengubah data tanaman!');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect('/admin/plant')->with('error', 'Gagal mengubah data tanaman: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, PlantType $plant)
    {
        DB::beginTransaction();

        try {
            // Delete image if exists
            if ($plant->img_path) {
                Storage::disk('public')->delete('plant/' . $plant->img_path);
            }

            $plant->delete();

            DB::commit();

            return redirect('/admin/plant')->with('success', 'Berhasil menghapus data tanaman!');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect('/admin/plant')->with('error', 'Gagal menghapus data tanaman: ' . $e->getMessage());
        }
    }
}
