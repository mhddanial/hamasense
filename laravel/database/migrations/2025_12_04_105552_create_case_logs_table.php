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
        Schema::create('case_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('case_id');

            // Catatan kondisi tanaman
            $table->text('message')->nullable();

            // Optional: Foto perkembangan harian
            $table->string('image_path')->nullable();

            // Tambahan dari update migration
            $table->text('ai_response')->nullable();
            $table->string('type')->default('follow_up');

            $table->timestamps();

            // Foreign key
            $table->foreign('case_id')->references('id')->on('cases')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_logs');
    }
};
