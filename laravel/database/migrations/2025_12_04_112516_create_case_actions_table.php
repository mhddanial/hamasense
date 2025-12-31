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
        Schema::create('case_actions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('case_id');

            // Jenis tindakan yang dilakukan
            $table->string('action_type');

            // Penjelasan tambahan
            $table->text('description')->nullable();

            // Waktu tindakan dilakukan
            $table->timestamp('performed_at')->nullable();

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
        Schema::dropIfExists('case_actions');
    }
};
