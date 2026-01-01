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
        Schema::create('community_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('community_posts')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('reason'); // 'spam', 'inappropriate', 'harassment', 'other'
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'reviewed', 'dismissed'])->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->unique(['post_id', 'user_id']); // One report per user per post
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_reports');
    }
};
