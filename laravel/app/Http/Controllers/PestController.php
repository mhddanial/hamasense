<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Pest;
use App\Models\PlantType;
use Illuminate\Http\Request;
use App\Models\PestCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PestController extends Controller
{
    public function userIndex(Request $request) {
        $search = $request->query('search');
        $category = $request->query('category');
        $risk = $request->query('risk');

        $pests = Pest::query()
            ->when($search, function ($query, $search) {
                $searchTerm = "%{$search}%";
                return $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'like', $searchTerm)
                      ->orWhere('scientific_name', 'like', $searchTerm);
                });
            })
            ->when($category && $category !== 'Semua Kategori', function ($query) use ($category) {
                return $query->where('category', $category);
            })
            ->when($risk && $risk !== 'Semua Risiko', function ($query) use ($risk) {
                return $query->where('risk_level', $risk);
            })
            ->latest()
            ->get();

        $categories = PestCategory::all();
        
        return Inertia::render('pest-info/index', [
            'pests' => $pests,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'risk' => $risk
            ]
        ]);
    }

    public function userShow($slug) {
        $pest = Pest::where('slug', $slug)->firstOrFail();
        return Inertia::render('pest-info/detail', [
            'pest' => $pest
        ]);
    }

    public function index(Request $request)
    {
        $search = $request->query('search');
        $category = $request->query('category');
        $risk = $request->query('risk');
        $sortBy = $request->query('sort', 'latest');

        $pests = Pest::query()
            ->when($search, function ($query, $search) {
                $searchTerm = "%{$search}%";
                return $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'like', $searchTerm)
                      ->orWhere('scientific_name', 'like', $searchTerm);
                });
            })
            ->when($category && $category !== 'Semua Kategori', function ($query) use ($category) {
                return $query->where('category', $category);
            })
            ->when($risk && $risk !== 'Semua Risiko', function ($query) use ($risk) {
                return $query->where('risk_level', $risk);
            });

        // Apply sorting
        switch ($sortBy) {
            case 'oldest':
                $pests->oldest();
                break;
            case 'name_asc':
                $pests->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $pests->orderBy('name', 'desc');
                break;
            default:
                $pests->latest();
                break;
        }

        $pests = $pests->paginate(10);

        $categories = PestCategory::all(); 

        return Inertia::render('admin/pest/index', [
            'pests' => $pests,
            'categories' => $categories,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'risk' => $risk,
                'sort' => $sortBy
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/pest/create', [
            'plants' => PlantType::all(),
            'categories' => PestCategory::all()
        ]);
    }

    public function show(Request $request, Pest $pest)
    {
        return Inertia::render('admin/pest/show', [
            'pest' => $pest->load('plant_type'),
            'plants' => PlantType::all()
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $field = $request->validate([
                'name' => 'required|string',
                'slug' => 'nullable|string|unique:pests,slug',
                'scientific_name' => 'required|string',
                'description' => 'nullable|string',
                'category' => 'required|string',
                'risk_level' => 'required|in:rendah,sedang,tinggi',
                'plants' => 'nullable|array',
                'plants.*' => 'string',
                'pencegahan' => 'nullable|array',
                'pencegahan.*' => 'string',
                'penanganan' => 'nullable|array',
                'penanganan.*' => 'string',
                'img_path' => 'nullable|image',
            ]);

            // Auto-generate slug from name if not provided
            if (empty($field['slug'])) {
                $field['slug'] = Str::slug($field['name']) . '-' . uniqid();
            }

            if($request->hasFile('img_path')) {
                $file = $request->file('img_path');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();
                
                $file->storeAs('pest', $file_name, 'public');
                $field['img_path'] = $file_name;
            }

            $new_pest = Pest::create($field);
            $new_pest->plant_type()->sync($field['plants']);

            DB::commit();

            return redirect('admin/pest')->with('success', 'New Pest Added Successfully!');

        } catch(\Exception $e) {
            DB::rollBack();
            return redirect('admin/pest')->with('error', 'Gagal menambahkan data hama: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Pest $pest)
    {
        DB::beginTransaction();
        
        try{
            $field = $request->validate([
                'name' => 'required|string',
                'slug' => 'nullable|string|unique:pests,slug,' . $pest->id,
                'scientific_name' => 'required|string',
                'description' => 'nullable|string',
                'category' => 'required|string',
                'risk_level' => 'required|in:rendah,sedang,tinggi',
                'plant' => 'nullable|array',
                'plant.*' => 'string',
                'pencegahan' => 'nullable|array',
                'pencegahan.*' => 'string',
                'penanganan' => 'nullable|array',
                'penanganan.*' => 'string',
                'new_img' => 'nullable|image',
                'old_img' => 'nullable|string'
            ]);

            // Auto-generate slug from name if not provided
            if (empty($field['slug'])) {
                $field['slug'] = Str::slug($field['name']) . '-' . uniqid();
            }
            
            if($request->hasFile('new_img')){
                Storage::disk('public')->delete('/pest/' . $pest->img_path);
                $file = $request->file('new_img');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('pest', $file_name, 'public');
                $field['img_path'] = $file_name;
            }

            $pest->update([
                'name' => $field['name'],
                'slug' => $field['slug'],
                'scientific_name' => $field['scientific_name'],
                'description' => $field['description'] ?? null,
                'category' => $field['category'],
                'risk_level' => $field['risk_level'],
                'plant' => $field['plant'] ?? null,
                'pencegahan' => $field['pencegahan'] ?? null,
                'penanganan' => $field['penanganan'] ?? null,
                'img_path' => $field['img_path'] ?? $pest->img_path,
            ]);

            DB::commit();
            return redirect('admin/pest')->with('success', 'Data hama berhasil diperbarui!');

        }catch(\Exception $e) {
            DB::rollBack();

            return redirect('admin/pest')->with('error', 'Error when updating pest: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, Pest $pest)
    {
        DB::beginTransaction();
        
        try{
            $pest->plantTypes()->detach();
            
            if ($pest->img_path) {
                Storage::disk('public')->delete('pest/' . $pest->img_path);
            }
            $pest->delete();
            DB::commit();

            return redirect('admin/pest')->with('success', 'Pest Deleted Successfully!');
        }catch(\Exception $e) {
            DB::rollBack();

            return redirect('admin/pest')->with('error', 'Error when deleting pest: ' . $e->getMessage());
        }
    }
}
