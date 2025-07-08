<?php
// database/migrations/2025_07_08_000002_increase_string_lengths.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class IncreaseStringLengths extends Migration
{
    public function up()
    {
        // Za ovakve izmene je potreban doctrine/dbal
        Schema::table('users', function (Blueprint $table) {
            $table->string('name', 150)->change();
            $table->string('surname', 150)->change();
            $table->string('role', 100)->change();
            $table->string('phone', 50)->change();
        });

        Schema::table('groups', function (Blueprint $table) {
            $table->string('name', 150)->change();
            $table->string('slug', 150)->change();
            $table->string('privacy', 50)->change();
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->string('currency', 5)->change();
            $table->string('category', 50)->change();
            $table->string('payment_method', 50)->change();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('name')->change();
            $table->string('surname')->change();
            $table->string('role')->change();
            $table->string('phone')->change();
        });

        Schema::table('groups', function (Blueprint $table) {
            $table->string('name')->change();
            $table->string('slug')->change();
            $table->string('privacy')->change();
        });

        Schema::table('expenses', function (Blueprint $table) {
            $table->string('currency', 3)->change();
            $table->string('category')->change();
            $table->string('payment_method')->change();
        });
    }
}
