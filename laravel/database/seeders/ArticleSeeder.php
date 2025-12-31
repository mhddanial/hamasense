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
            
            // Split by semicolon at end of statement (followed by newline or end)
            // This handles multi-line INSERT statements with special characters in data values
            $statements = preg_split('/;\s*\n/', $sql);
            
            foreach ($statements as $statement) {
                $statement = trim($statement);
                // Find and execute INSERT statements (may not be at position 0 due to comments)
                $insertPos = stripos($statement, 'INSERT INTO');
                if ($insertPos !== false) {
                    $insertStatement = substr($statement, $insertPos);
                    DB::unprepared($insertStatement);
                }
            }
            
            $this->command->info('Articles seeded from SQL file.');
        } else {
            $this->command->error('SQL file not found: ' . $sqlPath);
        }
    }
}
