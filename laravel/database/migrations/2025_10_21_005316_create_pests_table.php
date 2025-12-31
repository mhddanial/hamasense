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
        Schema::create('pests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->nullable()->unique();
            $table->string('scientific_name');
            $table->text('description')->nullable();
            $table->string('img_path')->nullable();
            $table->string('category')->default('Serangga');
            $table->enum('risk_level', ['rendah', 'sedang', 'tinggi'])->default('sedang');
            $table->json('plant')->nullable();
            $table->json('pencegahan')->nullable();
            $table->json('penanganan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pests');
    }
};