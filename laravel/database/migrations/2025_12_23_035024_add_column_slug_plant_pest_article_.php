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
        Schema::table('plant_types', function (Blueprint $table) {
            $table->string('slug')->nullable();
        });

        // Schema::table('pests', function (Blueprint $table) {
        //     $table->string('slug')->unique();
        // });

        Schema::table('diseases', function (Blueprint $table) {
            $table->string('slug')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plant_types', function (Blueprint $table) {
            $table->dropColumn('slug');
        });

        // Schema::table('pests', function (Blueprint $table) {
        //     $table->dropColumn('slug');
        // });

        Schema::table('diseases', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
