<?php

namespace App\Http\Controllers;

use App\Models\Pest;
use App\Models\PestImg;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PestController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/pest/index', [
            'pests' => Pest::all()
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/pest/create');
    }

    public function show(Request $request, Pest $pest)
    {
        return Inertia::render('admin/pest/show', [
            'message' => 'testing',
            'pest' => $pest
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
                'description' => 'required|string',
                'images' => 'required|array',
                'images.*' => 'image'
            ]);

            $new_pest = Pest::create($field);

            $files = $request->file('images');

            $images = [];

            foreach ($files as $file) {
                $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                $images[] = [
                    'pest_id' => $new_pest->id,
                    'filename' => $filename 
                ];
                
                $file->storeAs('images', $filename, 'public');
            }
            $img = PestImg::insert($images);

            DB::commit();

            // return response()->json([
            //     'img' => $img,
            //     'new_pest' => $new_pest
            // ]);

            return redirect('admin/pest')->with('success', 'New Pest Added Successfully!');

        } catch(\Exception $e) {
            DB::rollBack();

            // return response()->json([
            //     'e'=> $e->getMessage()
            // ]);

            return redirect('admin/pest')->with('error', 'Error when adding new Pest data: '. $e->getMessage());

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
            return redirect('admin/pest')->with('success', 'Pest Updated Successfully!');

        }catch(\Exception $e) {
            DB::rollBack();

            return redirect('admin/pest')->with('error', 'Error when updating pest: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, Pest $pest)
    {
        DB::beginTransaction();
        
        try{
            $pest->delete();
            DB::commit();

            return redirect('admin/pest')->with('success', 'Pest Deleted Successfully!');
        }catch(\Exception $e) {
            DB::rollBack();

            return redirect('admin/pest')->with('error', 'Error when deleting pest: ' . $e->getMessage());
        }
    }
}
