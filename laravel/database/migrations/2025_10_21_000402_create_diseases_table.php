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
        Schema::create('diseases', function (Blueprint $table) {
            $table->id();
            $table->string('label')->unique();
            $table->string('name');
            $table->string('description')->nullable();
            $table->enum('severity_level', ['rendah', 'sedang', 'tinggi']);
            $table->string('img_path')->nullable();
            $table->foreignId('plant_type_id')->constrained(
                table:'plant_types',
                column:'id'
            );
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('diseases');
    }
};
