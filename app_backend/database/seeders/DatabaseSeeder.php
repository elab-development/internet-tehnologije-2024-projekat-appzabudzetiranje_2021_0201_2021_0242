<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
         // temporarily drop FK checks
        Schema::disableForeignKeyConstraints();

        // now it's safe to truncate
        DB::table('savings_reports')->truncate();

        // re-enable FK checks
        Schema::enableForeignKeyConstraints();

        // Order matters because of foreign keys
        $this->call([
            UserSeeder::class,
            GroupSeeder::class,
            SavingsReportSeeder::class,
            ExpenseSeeder::class,
        ]);
    }
}
