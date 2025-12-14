<?php

namespace App\Http\Controllers;

use App\Models\Plant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PlantController extends Controller
{
    public function index()
    {
        return response()->json(Plant::all());
    }
    
    public function dashboard()
    {
        return Inertia::render('admin/pest/kelola_hama');
    }

    public function create()
    {
        return Inertia::render('admin/pest/add_hama');
    }

    public function edit()
    {
        return Inertia::render('admin/pest/u_d_hama', [
            'message' => 'testing'
        ]);
    }

    public function get()
    {
        return response()->json([
            'datas' => Plant::all()
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
                'img_path' => 'image|nullable'
            ]);

            if($request->hasFile('img_path')) {
                $file = $request->file('img_path');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();

                $file->storeAs('plant', $file_name, 'public');
                $field['img_path'] = $file_name;

                // return response()->json([
                //     'message' => 'foto berhasil'
                // ]);
            }

            // return response()->json([
            //     'message' => 'foto gagal'
            // ]);

            $new_pest = Plant::create($field);

            DB::commit();

            // return redirect('admin/plant')->with('success', 'New Pest Added Successfully!');

        } catch(\Exception $e) {
            DB::rollBack();
            return redirect('admin/plant')->with('error', 'Failed to Add new Pest data: ' . $e->getMessage());
        }
    }

    public function update(Request $request, Plant $pest)
    {
        DB::beginTransaction();

        try{
            $field = $request->validate([
                'name' => 'required|string',
                'scientific_name' => 'required|string',
                'description' => 'required|string'
            ]);

            $pest->update($field);

            DB::commit();
            return redirect('admin/plant')->with('success', 'Pest Updated Successfully!');

        }catch(\Exception $e) {
            DB::rollBack();
            return redirect('admin/plant')->with('error', 'Failed to updated new Pest data: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, Plant $pest)
    {
        DB::beginTransaction();
        
        try{
            $pest->delete();

            DB::commit();
            return redirect('admin/plant')->with('success', 'Pest Deleted Successfully!');

        }catch(\Exception $e) {
            DB::rollBack();
            return redirect('admin/plant')->with('error', 'Failed to Deleted new Pest data: ' . $e->getMessage());
        }
    }

}
