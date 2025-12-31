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
        Schema::create('scheduled_checks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('case_id');

            // Jenis pengecekan / reminder
            $table->string('check_type');

            // Waktu reminder berikutnya
            $table->timestamp('scheduled_at');

            // Apakah notifikasi diaktifkan
            $table->boolean('notification_enabled')->default(true);

            // Status apakah sudah selesai
            $table->enum('status', ['pending', 'completed', 'missed'])->default('pending');

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
        Schema::dropIfExists('scheduled_checks');
    }
};
