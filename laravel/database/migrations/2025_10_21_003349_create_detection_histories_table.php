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
        Schema::create('detection_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plant_id')->constrained(
                table: 'plants',
                column:'id'
            );
            $table->foreignId('disease_id')->constrained(
                table:'diseases',
                column:'id'
            );
            // tambahkan yang di bawah ini jika ingin bisa akses
            // detection history langsung dari usernya
            // $table->foreignId('user_id')->constrained(
            //     table:'users',
            //     column:'id',
            // );
            $table->float('confidence');
            $table->string('image_path');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detection_histories');
    }
};
