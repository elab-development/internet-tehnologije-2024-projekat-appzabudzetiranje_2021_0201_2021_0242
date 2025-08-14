<?php
// database/seeders/SavingsReportSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SavingsReport;
use App\Models\User;

class SavingsReportSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        // Each user gets 3 monthly reports
        foreach ($users as $user) {
            SavingsReport::factory()
                ->for($user, 'user')
                ->count(3)
                ->create();
        }
    }
}
