<?php
// database/seeders/ExpenseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Expense;
use App\Models\SavingsReport;

class ExpenseSeeder extends Seeder
{
    public function run()
    {
        $reports = SavingsReport::all();

        // Each report gets 5 expenses
        foreach ($reports as $report) {
            Expense::factory()
                ->for($report, 'savingsReport')
                ->count(5)
                ->create();
        }
    }
}
