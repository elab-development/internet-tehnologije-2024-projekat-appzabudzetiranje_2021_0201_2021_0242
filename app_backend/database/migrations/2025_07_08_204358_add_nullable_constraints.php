<?php
// database/migrations/2025_07_08_000004_add_nullable_constraints.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNullableConstraints extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('image')->nullable()->change();
            $table->string('phone')->nullable()->change();
            $table->text('bio')->nullable()->change();
            $table->json('settings')->nullable()->change();
            $table->timestamp('email_verified_at')->nullable()->change();
        });

        Schema::table('groups', function (Blueprint $table) {
            $table->text('description')->nullable()->change();
            $table->string('privacy')->nullable()->change();
        });

        Schema::table('savings_reports', function (Blueprint $table) {
            $table->text('notes')->nullable()->change();
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->string('receipt_image')->nullable()->change();
            $table->string('recurring_interval')->nullable()->change();
            $table->json('tags')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->string('receipt_image')->nullable(false)->change();
            $table->string('recurring_interval')->nullable(false)->change();
            $table->json('tags')->nullable(false)->change();
        });

        Schema::table('savings_reports', function (Blueprint $table) {
            $table->text('notes')->nullable(false)->change();
        });

        Schema::table('groups', function (Blueprint $table) {
            $table->text('description')->nullable(false)->change();
            $table->string('privacy')->nullable(false)->change();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->string('image')->nullable(false)->change();
            $table->string('phone')->nullable(false)->change();
            $table->text('bio')->nullable(false)->change();
            $table->json('settings')->nullable(false)->change();
            $table->timestamp('email_verified_at')->nullable(false)->change();
        });
    }
}
