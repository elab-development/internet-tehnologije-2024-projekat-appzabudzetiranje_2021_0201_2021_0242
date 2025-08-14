<?php
// database/factories/SavingsReportFactory.php

namespace Database\Factories;

use App\Models\SavingsReport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SavingsReportFactory extends Factory
{
    protected $model = SavingsReport::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'year'    => $this->faker->year,
            'month'   => $this->faker->numberBetween(1, 12),
            'notes'   => $this->faker->optional()->sentence,
        ];
    }
}
