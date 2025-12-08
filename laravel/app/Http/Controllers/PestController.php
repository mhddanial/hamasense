<?php

namespace App\Http\Controllers;

use App\Models\Pest;
use App\Models\PestImg;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PestController extends Controller
{
    public function userIndex()
    {
        return Inertia::render('pest-info/index', [
            'pests' => Pest::with('plantTypes')->get()
        ]);
    }

    public function index()
    {
        return Inertia::render('admin/pest/index', [
            'pests' => Pest::with('plantTypes')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/pest/create', [
            'plantTypes' => \App\Models\PlantType::all()
        ]);
    }

    public function show(Request $request, Pest $pest)
    {
        $pest->load(['plantTypes', 'images']);
        return Inertia::render('admin/pest/show', [
            'pest' => $pest,
        ]);
    }

    public function get()
    {
        return response()->json([
            'datas' => Pest::with('plantTypes')->get()
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
                'images' => 'required|array',
                'images.*' => 'image|max:2048',
                'category' => 'required|string',
                'risk_level' => 'required|string',
                'plant_types' => 'nullable|array',
                'plant_types.*' => 'string'
            ]);

            // Buat Hama terlebih dahulu untuk mendapatkan ID
            // Menetapkan image_path menjadi null awalnya
            $new_pest = Pest::create([
                'name' => $field['name'],
                'scientific_name' => $field['scientific_name'],
                'description' => $field['description'],
                'category' => $field['category'],
                'risk_level' => $field['risk_level'],
                // path_gambar akan diperbarui setelah gambar diunggah
            ]);

            $files = $request->file('images');
            $imagesData = [];
            $firstImagePath = null;

            foreach ($files as $index => $file) {
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $path = 'images/' . $filename; // Path relatif untuk penyimpanan
                $file->storeAs('images', $filename, 'public'); // Simpan di storage/app/public/images

                $imagesData[] = [
                    'pest_id' => $new_pest->id,
                    'filename' => $filename 
                ];

                // Gunakan gambar pertama sebagai thumbnail utama
                if ($index === 0) {
                    $firstImagePath = 'images/' . $filename;
                }
            }

            if (!empty($imagesData)) {
                PestImg::insert($imagesData);
            }

            // Perbarui jalur gambar utama
            if ($firstImagePath) {
                $new_pest->update(['image_path' => $firstImagePath]);
            }

            if (!empty($request->plant_types)) {
                $plantIds = [];
                foreach ($request->plant_types as $plantName) {
                    $plant = \App\Models\PlantType::firstOrCreate(
                        ['name' => $plantName],
                        ['scientific_name' => '-', 'detail' => '-']
                    );
                    $plantIds[] = $plant->id;
                }
                $new_pest->plantTypes()->sync($plantIds);
            }

            DB::commit();

            return redirect('admin/pest')->with('success', 'Data hama berhasil ditambahkan!');

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
                'category' => 'required|string',
                'risk_level' => 'required|string',
                'images' => 'nullable|array',
                'images.*' => 'image|max:2048',
                'plant_types' => 'nullable|array',
                'plant_types.*' => 'string',
                'deleted_images' => 'nullable|array',
                'deleted_images.*' => 'string'
            ]);

            $pest->update([
                'name' => $field['name'],
                'scientific_name' => $field['scientific_name'],
                'description' => $field['description'],
                'category' => $field['category'],
                'risk_level' => $field['risk_level'],
            ]);

            // Menangani gambar baru
            if ($request->hasFile('images')) {
                $files = $request->file('images');
                $imagesData = [];
                
                foreach ($files as $file) {
                    $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                    $file->storeAs('images', $filename, 'public');

                    $imagesData[] = [
                        'pest_id' => $pest->id,
                        'filename' => $filename 
                    ];
                }
                
                if (!empty($imagesData)) {
                    PestImg::insert($imagesData);
                }
            }

            // Menangani penghapusan gambar
            if (!empty($request->deleted_images)) {
                $imagesToDelete = PestImg::whereIn('filename', $request->deleted_images)
                                        ->where('pest_id', $pest->id)
                                        ->get();

                foreach ($imagesToDelete as $img) {
                    Storage::disk('public')->delete('images/' . $img->filename);
                    $img->delete();
                }
            }

            // Sync Plant Types
            if (isset($request->plant_types)) {
                $plantIds = [];
                foreach ($request->plant_types as $plantName) {
                    $plant = \App\Models\PlantType::firstOrCreate(
                        ['name' => $plantName],
                        ['scientific_name' => '-', 'detail' => '-']
                    );
                    $plantIds[] = $plant->id;
                }
                $pest->plantTypes()->sync($plantIds);
            }

            // Update main image_path if needed
            $firstImage = $pest->images()->first();
            if ($firstImage) {
                $pest->update(['image_path' => 'images/' . $firstImage->filename]);
            } else {
                 $pest->update(['image_path' => null]);
            }

            DB::commit();
            return redirect('admin/pest')->with('success', 'Data hama berhasil diperbarui!');

        }catch(\Exception $e) {
            DB::rollBack();
            return redirect('admin/pest')->with('error', 'Gagal memperbarui data hama: ' . $e->getMessage());
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
