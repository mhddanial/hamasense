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
        
        $plants = PlantType::query()->when($keyword, function ($query, $keyword) {
            $search_term = "%{$keyword}%";
            return $query->where(function ($q) use ($search_term) {
                $q->where('name', 'like', $search_term)
                    ->orWhere('scientific_name',  'like', $search_term);
            });
        })->latest()->paginate(8);


        return Inertia::render('admin/plant/index', [
            'plants' => $plants
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/plant/create', [
            'pests' => Pest::all()
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $field = $request->validate([
                'name' => 'required|string',
                'scientific_name' => 'required|string',
                'detail' => 'required|string',
                'img_path' => 'required|image',
                'slug' => 'string|nullable',
                'pests' => 'array',
                'pests*' => 'integer'
            ]);

            

            if (empty($field['slug'])) {
                $field['slug'] = Str::slug($field['name']) . '-' . uniqid(); 
            }

            if($request->hasFile('img_path')) {
                $file = $request->file('img_path');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();

                $file->storeAs('plant', $file_name, 'public');
                $field['img_path'] = $file_name;
            }
    
            $plant_type = PlantType::create($field);
    
            $plant_type->pest()->sync($field['pests']);
            DB::commit();

            return redirect('admin/plant')->with('success', 'New Plant Type Added Successfully');
        }catch (\Exception $e) {
            DB::rollBack();

            return redirect('admin/plant')->with('error', 'Error when create new plant: ' . $e->getMessage());
        }
    }

    public function show(Request $request, PlantType $plant)
    {
        return Inertia::render('admin/plant/show', [
            'plant' => $plant->load('pest'),
            'pests' => Pest::all(),
            'diseases' => Disease::all()
        ]);
    }

    public function update(Request $request, PlantType $plant)
    {

        DB::beginTransaction();
        $redirect_url = '/admin/plant/' . $plant->slug;

        try {
            $field = $request->validate([
                'name' => 'required|string',
                'detail' => 'required|string',
                'scientific_name' => 'required|string',
                'new_img' => 'image|nullable',
                'old_img' => 'string|nullable',
                'slug' => 'string|nullable',
                'pests' => 'array',
                'pests*' => 'integer'
            ]);

            // return $request->all();
            $plant->pest()->sync($field['pests'] ?? []);

            if (empty($field['slug'])) {
                $field['slug'] = Str::slug($field['name']) . '-' . uniqid(); 
            }
                // jika kondisi ada new_img ada foto maka upload foto baru
            if($request->hasFile('new_img')){
                Storage::disk('public')->delete('/plant/' . $plant->img_path);
                $file = $request->file('new_img');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('plant', $file_name, 'public');
                $field['img_path'] = $file_name;
            }

            $plant->update($field);
            
            DB::commit();

            return redirect('/admin/plant')->with('success', 'Berhasil mengubah data Tanaman');
        }catch(\Exception $e) {
            DB::rollBack();

            return redirect('/admin/plant')->with('error', 'Gagal mengubah data tanaman: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, PlantType $plant)
    {
        DB::beginTransaction();
        
        try{
            $img_path = $plant->img_path;
            Storage::disk('public')->delete('/plant/' . $img_path);

            $plant->delete();

            DB::commit();
            return redirect('/admin/plant')->with('success', 'Berhasil menghapus data tanaman');
        } catch(\Exception $e) {
            DB::rollback();
            return redirect('/admin/plant')->with('success', 'Gagal menghapus data tanaman: ' . $e->getMessage());

        }
        
    }
}
