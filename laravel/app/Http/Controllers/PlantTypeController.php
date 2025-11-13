<?php

namespace App\Http\Controllers;

use App\Models\PlantType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PlantTypeController extends Controller
{
    public function index()
    {
        $plants = PlantType::all();

        return Inertia::render('admin/plant/index', [
            'plants' => $plants
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
                'detail' => 'required|string'
            ]);
    
            $plant_type = PlantType::create($field);
    
            DB::commit();

            return redirect('admin/plant')->with('success', 'New Plant Type Added Successfully');
        }catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage()
            ]);

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
        DB::beginTransaction();

        $redirect_url = '/admin/plant/' . $plant->id;

        try {
            $field = $request->validate([
                'name' => 'required|string'
            ]);

            $plant->update($field);

            DB::commit();

            return redirect($redirect_url)->with('success', 'Berhasil mengubah data Tanaman');
        }catch(\Exception $e) {
            DB::rollBack();
            return redirect($redirect_url)->with('error', 'Gagal mengubah data tanaman: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, PlantType $plant)
    {
        DB::beginTransaction();
        
        try{
            $plant->delete();

            return redirect('/admin/plant')->with('success', 'Berhasil menghapus data tanaman');
        } catch(\Exception $e) {
            return redirect('/admin/plant')->with('success', 'Gagal menghapus data tanaman: ' . $e->getMessage());

        }
        
    }
}
