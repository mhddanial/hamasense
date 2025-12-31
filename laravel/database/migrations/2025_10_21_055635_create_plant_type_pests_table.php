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
        Schema::create('plant_type_pests', function (Blueprint $table) {
            $table->foreignId('plant_type_id')->constrained(
                table:'plant_types',
                column: 'id'
            )->onDelete('cascade')->onUpdate('cascade');;
            $table->foreignId('pest_id')->constrained(
                table:'pests',
                column:'id'
            )->onDelete('cascade')->onUpdate('cascade');;
            $table->primary(['plant_type_id', 'pest_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plant_type_pests');
    }
};
