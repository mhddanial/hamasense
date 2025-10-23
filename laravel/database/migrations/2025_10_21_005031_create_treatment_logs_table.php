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
        Schema::create('treatment_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('detection_id')->constrained(
                table:'detection_histories',
                column:'id'
            );
            $table->text('outcome_note');
            $table->text('treatment_note');
            $table->string('action_taken');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('treatment_logs');
    }
};
