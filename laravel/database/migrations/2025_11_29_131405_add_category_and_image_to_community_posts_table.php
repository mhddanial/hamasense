<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('community_posts', function (Blueprint $table) {
            $table->string('category')->after('content');
            $table->string('image')->nullable()->after('category');
            $table->integer('like_total')->default(0)->change();
        });
    }

    public function down()
    {
        Schema::table('community_posts', function (Blueprint $table) {
            $table->dropColumn(['category', 'image']);
        });
    }
};
