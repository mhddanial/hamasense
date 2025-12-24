<?php

namespace App\Http\Controllers;

use App\Models\PlantType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PlantTypeController extends Controller
{
    public function index(Request $request)
    {
        
        $keyword = $request->query('keyword');
        
        $plants = PlantType::query()->when($keyword, function ($query, $keyword) {
            $search_term = "{$keyword}%";
            return $query->where(function ($q) use ($search_term) {
                $q->where('name', 'like', $search_term)
                    ->orWhere('scientific_name',  'like', $search_term);
            });
        })->latest()->paginate(8);


        return Inertia::render('admin/plant/index', [
            'plants' => $plants,
            'search' => $keyword
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/plant/create');
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $field = $request->validate([
                'name' => 'required|string',
                'scientific_name' => 'required|string',
                'detail' => 'required|string',
                'img_path' => 'required|image'
            ]);

            
            if($request->hasFile('img_path')) {
                $file = $request->file('img_path');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();

                $file->storeAs('plant', $file_name, 'public');
                $field['img_path'] = $file_name;

            }
    
            $plant_type = PlantType::create($field);
    
            DB::commit();

            return redirect('admin/plant')->with('success', 'New Plant Type Added Successfully');
        }catch (\Exception $e) {
            DB::rollBack();

            // return response()->json([
            //     'message' => $e->getMessage()
            // ]);

            return redirect('admin/plant')->with('error', 'Error when create new plant: ' . $e->getMessage());
        }
    }

    public function show(Request $request, PlantType $plant)
    {
        return Inertia::render('admin/plant/show', [
            'plant' => $plant
        ]);
    }

    public function update(Request $request, PlantType $plant)
    {
        // return response()->json([
        //     'message'=> $request->all()
        // ]);

        DB::beginTransaction();

        $redirect_url = '/admin/plant/' . $plant->id;

        try {
            $field = $request->validate([
                'name' => 'required|string',
                'detail' => 'required|string',
                'scientific_name' => 'required|string',
                'new_img' => 'image|nullable',
                'old_img' => 'string|nullable'
            ]);

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

            return response()->json([
                'message'=> 'berhasil'
            ]);

            return redirect($redirect_url)->with('success', 'Berhasil mengubah data Tanaman');
        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message'=> $e->getMessage()
            ]);

            return redirect($redirect_url)->with('error', 'Gagal mengubah data tanaman: ' . $e->getMessage());
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
