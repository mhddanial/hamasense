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
        Schema::table('cases', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->after('id')->index();
            $table->string('label')->nullable()->after('pest_name');
            $table->float('confidence')->nullable()->after('label');
            $table->float('entropy')->nullable()->after('confidence');
            $table->json('ai_summary')->nullable()->after('recommended_treatment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cases', function (Blueprint $table) {
            $table->dropColumn(['user_id', 'label', 'confidence', 'entropy', 'ai_summary']);
        });
    }
};
