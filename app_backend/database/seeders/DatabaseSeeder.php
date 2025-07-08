<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Order matters because of foreign keys
        $this->call([
            UserSeeder::class,
            GroupSeeder::class,
            SavingsReportSeeder::class,
            ExpenseSeeder::class,
        ]);
    }
}
