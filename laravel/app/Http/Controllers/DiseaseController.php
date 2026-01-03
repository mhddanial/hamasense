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
        $sortBy = $request->query('sort', 'latest');

        $diseases = Disease::query()
            ->when($keyword, function ($query, $keyword) {
                $search_term = "%$keyword%";
                return $query->where(function ($q) use ($search_term) {
                    $q->where('name', 'like', $search_term);
                });
            });

        // Apply sorting
        switch ($sortBy) {
            case 'oldest':
                $diseases->oldest();
                break;
            case 'name_asc':
                $diseases->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $diseases->orderBy('name', 'desc');
                break;
            default:
                $diseases->latest();
                break;
        }

        $diseases = $diseases->paginate(10);

        return Inertia::render('admin/disease/index', [
            'diseases' => $diseases,
            'filters' => [
                'keyword' => $keyword,
                'sort' => $sortBy
            ]
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
                'label' => 'required|string|unique:diseases,label',
                'name' => 'required|string',
                'description' => 'nullable|string',
                'severity_level' => 'required|in:rendah,sedang,tinggi',
                'plant_type_id' => 'required|numeric',
                'img_path' => 'image|nullable',
            ]);

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

            return redirect('admin/disease')->with('success', 'Penyakit baru berhasil ditambahkan!');

        } catch(\Exception $e) {
            DB::rollBack();

            // return response()->json([
            //     'e'=> $e->getMessage()
            // ]);

            return redirect('admin/disease')->with('error', 'Gagal menambahkan data penyakit: '. $e->getMessage());

        }
    }

    public function update(Request $request, Disease $disease)
    {
        DB::beginTransaction();

        // return $request->all();

        try{
            $field = $request->validate([
                'label' => 'required|string|unique:diseases,label,' . $disease->id,
                'name' => 'required|string',
                'description' => 'nullable|string',
                'severity_level' => 'required|in:rendah,sedang,tinggi',
                'plant_type_id' => 'required|numeric',
                'new_img' => 'image|nullable',
            ]);

            if($request->hasFile('new_img')){
                Storage::disk('public')->delete('/disease/' . $disease->img_path);
                $file = $request->file('new_img');
                $file_name = uniqid() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('disease', $file_name, 'public');
                $field['img_path'] = $file_name;
            }


            $disease->update($field);
            DB::commit();

            return redirect('admin/disease')->with('success', 'Penyakit berhasil diperbarui!');

        }catch(\Exception $e) {
            DB::rollBack();

            return redirect('admin/disease')->with('error', 'Gagal memperbarui data penyakit: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request, Disease $disease)
    {
        DB::beginTransaction();
        
        try{

            Storage::disk('public')->delete('/disease/' . $disease->img_path);

            $disease->delete();
            DB::commit();

            return redirect('admin/disease')->with('success', 'Penyakit berhasil dihapus!');
        }catch(\Exception $e) {
            DB::rollBack();

            return redirect('admin/disease')->with('error', 'Gagal menghapus data penyakit: ' . $e->getMessage());
        }
    }
}
