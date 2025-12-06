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
        Schema::create('cases', function (Blueprint $table) {
            $table->id();

            // Relasi ke riwayat deteksi
            $table->unsignedBigInteger('detection_history_id');

            // Informasi dasar tanaman / hama dari hasil deteksi
            $table->string('plant_name')->nullable();
            $table->string('pest_name')->nullable();
            $table->string('image_path')->nullable();

            // Rekomendasi utama dari sistem
            $table->text('recommended_treatment')->nullable();

            // Status case
            $table->enum('status', ['active', 'in_progress', 'resolved', 'cancelled'])->default('active');

            $table->timestamps();

            // Foreign key
            $table->foreign('detection_history_id')->references('id')->on('detection_histories');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cases');
    }
};
