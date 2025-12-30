<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sqlPath = database_path('sql/articles.sql');
        
        if (file_exists($sqlPath)) {
            $sql = file_get_contents($sqlPath);
            
            // Extract only INSERT statements
            preg_match_all('/INSERT INTO.*?;/s', $sql, $matches);
            
            foreach ($matches[0] as $insertStatement) {
                DB::unprepared($insertStatement);
            }
            
            $this->command->info('Articles seeded from SQL file.');
        } else {
            $this->command->error('SQL file not found: ' . $sqlPath);
        }
    }
}
