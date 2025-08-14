<?php
// database/migrations/2025_07_08_000001_add_foreign_keys.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddForeignKeys extends Migration
{
    public function up()
    {
        Schema::table('groups', function (Blueprint $table) {
            $table->foreign('owner_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');
        });

        Schema::table('group_user', function (Blueprint $table) {
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');
            $table->foreign('group_id')
                  ->references('id')->on('groups')
                  ->onDelete('cascade');
        });

        Schema::table('savings_reports', function (Blueprint $table) {
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->foreign('savings_report_id')
                  ->references('id')->on('savings_reports')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['savings_report_id']);
        });
        Schema::table('savings_reports', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });
        Schema::table('group_user', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['group_id']);
        });
        Schema::table('groups', function (Blueprint $table) {
            $table->dropForeign(['owner_id']);
        });
    }
}
