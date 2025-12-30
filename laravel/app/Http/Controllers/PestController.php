<?php

namespace App\Http\Controllers;

use App\Models\Pest;
use App\Models\PlantType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PestController extends Controller
{
    public function userIndex() {
        $pests = Pest::all();
        return Inertia::render('pest-info/index', [
            'pests' => $pests
        ]);
    }

    public function index(Request $request)
    {
        $keyword = $request->query('keyword');
        $pests = Pest::query()->when($keyword, function ($query, $keyword) {
            $search_term = "%{$keyword}%";
            return $query->where(function ($q) use ($search_term) {
                $q->where('name', 'like', $search_term)
                    ->orWhere('scientific_name', 'like', $search_term);
            });
        })->latest()->paginate(8);

        return Inertia::render('admin/pest/index', [
            'pests' => $pests
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/pest/create', [
            'plants' => \App\Models\PlantType::all(),
        ]);
    }

    public function show(Request $request, Pest $pest)
    {
        // $pest->load(['plantTypes', 'images']);
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
                'scientific_name' => 'required|string',
                'description' => 'required|string',
                'img_path' => 'image',
                'slug' => 'string|nullable',
                'plants' => 'array',
                'plants*' => 'integer'
            ]);

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
                'scientific_name' => 'required|string',
                'description' => 'required|string',
                'new_img' => 'image|nullable',
                'old_img' => 'string|nullable',
                'slug' => 'string|nullable',
                'plants*' => 'integer',
                'plants' => 'array'
            ]);

            $pest->plant_type()->sync($field['plants'] ?? []);
            
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
                'scientific_name' => $field['scientific_name'],
                'description' => $field['description'],
                // 'category' => $field['category'],
                // 'risk_level' => $field['risk_level'],
                'slug' => $field['slug']
            ]);

            // // Menangani gambar baru
            // if ($request->hasFile('images')) {
            //     $files = $request->file('images');
            //     $imagesData = [];
                
            //     foreach ($files as $file) {
            //         $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            //         $file->storeAs('images', $filename, 'public');

            //         $imagesData[] = [
            //             'pest_id' => $pest->id,
            //             'filename' => $filename 
            //         ];
            //     }
                
            //     if (!empty($imagesData)) {
            //         PestImg::insert($imagesData);
            //     }
            // }

            // // Menangani penghapusan gambar
            // if (!empty($request->deleted_images)) {
            //     $imagesToDelete = PestImg::whereIn('filename', $request->deleted_images)
            //                             ->where('pest_id', $pest->id)
            //                             ->get();

            //     foreach ($imagesToDelete as $img) {
            //         Storage::disk('public')->delete('images/' . $img->filename);
            //         $img->delete();
            //     }
            // }

            // // Sync Plant Types
            // if (isset($request->plant_types)) {
            //     $plantIds = [];
            //     foreach ($request->plant_types as $plantName) {
            //         $plant = \App\Models\PlantType::firstOrCreate(
            //             ['name' => $plantName],
            //             ['scientific_name' => '-', 'detail' => '-']
            //         );
            //         $plantIds[] = $plant->id;
            //     }
            //     $pest->plantTypes()->sync($plantIds);
            // }

            // // Update main image_path if needed
            // $firstImage = $pest->images()->first();
            // if ($firstImage) {
            //     $pest->update(['image_path' => 'images/' . $firstImage->filename]);
            // } else {
            //      $pest->update(['image_path' => null]);
            // }

            DB::commit();
            return redirect('admin/pest')->with('success', 'Data hama berhasil diperbarui!');

        }catch(\Exception $e) {
            DB::rollBack();
            return [
                'message' => $e->getMessage()
            ];

            return redirect('admin/pest')->with('error', 'Error when updating pest: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, Pest $pest)
    {
        DB::beginTransaction();
        
        try{
            $pest->plantTypes()->detach();
            
            if ($pest->image_path) {
                Storage::disk('public')->delete($pest->image_path);
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
