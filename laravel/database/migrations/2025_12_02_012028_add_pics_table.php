<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('article_imgs', function (Blueprint $table) {
            $table->foreignId('article_id')->constrained(table: 'articles', column: 'id');
            $table->string('filename')->primary();
        });
        Schema::create('pest_imgs', function (Blueprint $table) {
            $table->foreignId('pest_id')->constrained(table: 'pests', column: 'id');
            $table->string('filename')->primary();
        });
        Schema::create('plant_imgs', function (Blueprint $table) {
            $table->foreignId('plant_id')->constrained(table: 'plant_types', column: 'id');
            $table->string('filename')->primary();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_imgs');
        Schema::dropIfExists('pest_imgs');
        Schema::dropIfExists('plant_imgs');
    }
};
