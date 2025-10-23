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
        Schema::create('pest_cause_diseases', function (Blueprint $table) {
            $table->foreignId('pest_id')->constrained(
                table:'pests',
                column:'id'
            );
            $table->foreignId('disease_id')->constrained(
                table:'diseases',
                column:'id'
            );
            $table->primary(['pest_id', 'disease_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pest_cause_diseases');
    }
};
