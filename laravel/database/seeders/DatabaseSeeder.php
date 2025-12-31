<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Base tables (no foreign key dependencies)
            UserSeeder::class,
            PlantTypeSeeder::class,
            ArticleCategorySeeder::class,
            
            // Tables with foreign key dependencies
            DiseaseSeeder::class,     
            ArticleSeeder::class,      
            CommunityCategorySeeder::class,
            PestSeeder::class,
        ]);
    }
}
