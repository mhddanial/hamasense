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
        Schema::create('community_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained(
                table: 'community_posts',
                column: 'id'
            )->onDelete('cascade');  // TAMBAH

            $table->foreignId('user_id')->constrained(
                table: 'users',
                column: 'id'
            )->onDelete('cascade');  // TAMBAH

            $table->foreignId('parent_id')->nullable()->constrained(
                table: 'community_comments',
                column: 'id'
            )->onDelete('cascade');  // TAMBAH
            $table->text('content');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('community_comments');
    }
};
