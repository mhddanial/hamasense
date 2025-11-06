<?php

namespace App\Http\Controllers;

use App\Models\Pest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PestController extends Controller
{
    public function index()
    {
        return response()->json(Pest::all());
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
            'datas' => Pest::all()
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $field = $request->validate([
                'name' => 'required|string',
                'scientific_name' => 'required|string',
                'description' => 'required|string'
            ]);

            $new_pest = Pest::create($field);

            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'New Pest Added Successfully',
                'result' => $new_pest
            ]);
        } catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function update(Request $request, Pest $pest)
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
            return response()->json([
                'status' => true,
                'message' => 'Pest\'s data updated successfully',
                'result' => $pest
            ]);
        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    public function destroy(Request $request, Pest $pest)
    {
        DB::beginTransaction();
        
        try{
            $pest->delete();

            DB::commit();
            return response()->json([
                'status' => true,
                'message' => 'Article deleted successfully',
            ]);
        }catch(\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

}
