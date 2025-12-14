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
                'img_path' => 'image'
            ]);

            if($request->hasFile('img_path')) {
                $file = $request->file('img_path');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();
                
                $file->storeAs('pest', $file_name, 'public');
                $field['img_path'] = $file_name;

            }

            $new_pest = Pest::create($field);

            DB::commit();


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
                'description' => 'required|string',
                'new_img' => 'image|nullable',
                'old_img' => 'string|nullable'
            ]);
            
            if($request->hasFile('new_img')){
                Storage::disk('public')->delete('/plant/' . $pest->img_path);
                $file = $request->file('new_img');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('pest', $file_name, 'public');
                $field['img_path'] = $file_name;
            }

            $pest->update($field);
            DB::commit();
            return redirect('admin/pest')->with('success', 'Pest Updated Successfully!');

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
            $pest->delete();
            DB::commit();

            return redirect('admin/pest')->with('success', 'Pest Deleted Successfully!');
        }catch(\Exception $e) {
            DB::rollBack();

            return redirect('admin/pest')->with('error', 'Error when deleting pest: ' . $e->getMessage());
        }
    }
}
