<?php
// database/migrations/2025_07_08_000000_create_initial_tables.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInitialTables extends Migration
{
    public function up()
    {
        // 1) USERS
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('surname');
            $table->string('email');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('image');
            $table->string('role');
            $table->string('phone');
            $table->text('bio');
            $table->json('settings');
            $table->string('status');
            $table->rememberToken();
            $table->timestamps();
        });

        // 2) GROUPS
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('owner_id');
            $table->text('description');
            $table->string('slug');
            $table->string('privacy');
            $table->timestamps();
        });

        // 3) SAVINGS REPORTS
        Schema::create('savings_reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->integer('year');
            $table->integer('month');
            $table->text('notes');
            $table->timestamps();
        });

        // 4) EXPENSES
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('savings_report_id');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3);
            $table->text('description');
            $table->date('date');
            $table->string('category');
            $table->string('payment_method');
            $table->string('receipt_image');
            $table->boolean('is_recurring');
            $table->string('recurring_interval');
            $table->json('tags');
            $table->timestamps();
        });

        // 5) PIVOT TABLE GROUP_USER
        Schema::create('group_user', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('group_id');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('group_user');
        Schema::dropIfExists('expenses');
        Schema::dropIfExists('savings_reports');
        Schema::dropIfExists('groups');
        Schema::dropIfExists('users');
    }
}
