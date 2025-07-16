<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        DB::table('savings_reports')->truncate();
        // Order matters because of foreign keys
        $this->call([
            UserSeeder::class,
            GroupSeeder::class,
            SavingsReportSeeder::class,
            ExpenseSeeder::class,
        ]);
    }
}
