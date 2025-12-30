<?php

namespace App\Http\Controllers;

use App\Models\Disease;
use App\Models\PlantType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DiseaseController extends Controller
{
    public function index(Request $request)
    {
        $keyword = $request->query('keyword');
        $diseases = Disease::query()->when($keyword, function ($query, $keyword) {
            $search_term = "%$keyword%";
            return $query->where(function ($q) use ($search_term) {
                $q->where('name', 'like', $search_term);
            });
        })->latest()->paginate(8);

        return Inertia::render('admin/disease/index', [
            'diseases' => $diseases,
        ]);
    }

    public function create()
    {
        $plants = PlantType::all();

        return Inertia::render('admin/disease/create', [
            'plants' => $plants
        ]);
    }

    public function show(Request $request, Disease $disease)
    {
        $plants = PlantType::all();

        return Inertia::render('admin/disease/show', [
            'message' => 'testing',
            'disease' => $disease,
            'plants' => $plants
        ]);
    }

    public function get()
    {
        return response()->json([
            'datas' => Disease::all()
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $field = $request->validate([
                'name' => 'required|string',
                'cause' => 'required|string',
                'description' => 'required|string',
                'solution' => 'required|string',
                'severity_level' => 'required|numeric',
                'plant_type_id' => 'required|numeric',
                'img_path' => 'image|nullable',
                // 'plant_type_id' => 'required|numeric',
                'slug' => 'string|nullable'
            ]);

            if (empty($field['slug'])) {
                $field['slug'] = Str::slug($field['name']) . '-' . uniqid(); 
            }

            if($request->hasFile('img_path')) {
                $file = $request->file('img_path');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();
                
                $file->storeAs('disease', $file_name, 'public');
                $field['img_path'] = $file_name;
            }

            $new_pest = Disease::create($field);

            DB::commit();

            // return response()->json([
            //     'message' => $new_pest
            // ]);

            return redirect('admin/disease')->with('success', 'New Disease Added Successfully!');

        } catch(\Exception $e) {
            DB::rollBack();

            // return response()->json([
            //     'e'=> $e->getMessage()
            // ]);

            return redirect('admin/disease')->with('error', 'Error when adding new Disease data: '. $e->getMessage());

        }
    }

    public function update(Request $request, Disease $disease)
    {
        DB::beginTransaction();

        // return $request->all();

        try{
            $field = $request->validate([
                'name' => 'required|string',
                'cause' => 'required|string',
                'description' => 'required|string',
                'solution' => 'required|string',
                'severity_level' => 'required|numeric',
                'plant_type_id' => 'required|numeric',
                'new_img' => 'image|nullable',
                'slug' => 'string|nullable'
            ]);

            if (empty($field['slug'])) {
                $field['slug'] = Str::slug($field['name']) . '-' . uniqid(); 
            }

            if($request->hasFile('new_img')){
                Storage::disk('public')->delete('/disease/' . $disease->img_path);
                $file = $request->file('new_img');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('disease', $file_name, 'public');
                $field['img_path'] = $file_name;
            }


            $disease->update($field);
            DB::commit();

            return redirect('admin/disease')->with('success', 'Disease Updated Successfully!');

        }catch(\Exception $e) {
            DB::rollBack();

            return redirect('admin/disease')->with('error', 'Error when updating disease: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, Disease $disease)
    {
        DB::beginTransaction();
        
        try{

            Storage::disk('public')->delete('/disease/' . $disease->img_path);

            $disease->delete();
            DB::commit();

            return redirect('admin/disease')->with('success', 'Disease Deleted Successfully!');
        }catch(\Exception $e) {
            DB::rollBack();

            return redirect('admin/disease')->with('error', 'Error when deleting disease: ' . $e->getMessage());
        }
    }
}
