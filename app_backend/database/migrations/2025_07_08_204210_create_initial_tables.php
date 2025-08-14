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
            $table->string('image')->nullable();
            // enum za uloge
            $table->enum('role', ['regular', 'administrator'])->default('regular');
            $table->string('phone')->nullable();
            $table->text('bio')->nullable();
            // enum za status
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->rememberToken();
            $table->timestamps();
        });

        // 2) GROUPS
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('owner_id');
            $table->text('description')->nullable();
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
            $table->text('notes')->nullable();
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
            // enum za kategoriju troška (samo na engleskom)
            $table->enum('category', [
                'shopping',
                'food',
                'medicines',
                'sports_and_recreation',
                'entertainment',
                'bills',
            ]);
            // enum za način plaćanja
            $table->enum('payment_method', ['cash', 'card']);
            $table->string('receipt_image')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('recurring_interval')->nullable();
            $table->json('tags')->nullable();
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
