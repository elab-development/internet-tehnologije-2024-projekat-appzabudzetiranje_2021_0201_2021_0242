<?php
// database/migrations/2025_07_08_000003_add_unique_constraints.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUniqueConstraints extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->unique('email');
        });

        Schema::table('groups', function (Blueprint $table) {
            $table->unique('slug');
        });

        Schema::table('group_user', function (Blueprint $table) {
            $table->unique(['user_id', 'group_id']);
        });

        Schema::table('savings_reports', function (Blueprint $table) {
            $table->unique(['user_id', 'year', 'month']);
        });
    }

    public function down()
    {
        Schema::table('savings_reports', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'year', 'month']);
        });
        Schema::table('group_user', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'group_id']);
        });
        Schema::table('groups', function (Blueprint $table) {
            $table->dropUnique(['slug']);
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['email']);
        });
    }
}
