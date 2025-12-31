<?php

namespace Database\Seeders;

use App\Models\CommunityCategory;
use Illuminate\Database\Seeder;

class CommunityCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['slug' => 'budidaya', 'name' => 'Budidaya'],
            ['slug' => 'tips', 'name' => 'Tips & Trik'],
            ['slug' => 'hama', 'name' => 'Hama & Penyakit'],
            ['slug' => 'tanya', 'name' => 'Tanya Jawab'],
        ];

        foreach ($categories as $category) {
            CommunityCategory::updateOrCreate(
                ['slug' => $category['slug']],
                ['name' => $category['name']]
            );
        }
    }
}
