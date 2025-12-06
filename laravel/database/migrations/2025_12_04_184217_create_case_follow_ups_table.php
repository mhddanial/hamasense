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
        Schema::create('case_follow_ups', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('case_id');

            // Foto perkembangan terbaru
            $table->string('image_path')->nullable();

            // Hasil analisis AI terhadap foto terbaru
            $table->string('ai_label')->nullable();
            $table->float('ai_confidence')->nullable();
            $table->json('ai_info')->nullable();

            // Perbandingan dengan kondisi awal
            $table->text('comparison_result')->nullable();

            $table->timestamps();

            $table->foreign('case_id')->references('id')->on('cases')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_follow_ups');
    }
};
