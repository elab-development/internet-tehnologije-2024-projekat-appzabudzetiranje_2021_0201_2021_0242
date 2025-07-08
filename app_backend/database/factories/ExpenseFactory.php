<?php
// database/factories/ExpenseFactory.php

namespace Database\Factories;

use App\Models\Expense;
use App\Models\SavingsReport;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExpenseFactory extends Factory
{
    protected $model = Expense::class;

    public function definition()
    {
        $recurring = $this->faker->boolean(20);
        return [
            'savings_report_id' => SavingsReport::factory(),
            'amount'            => $this->faker->randomFloat(2, 1, 1000),
            'currency'          => $this->faker->currencyCode,
            'description'       => $this->faker->sentence,
            'date'              => $this->faker->date(),
            'category'          => $this->faker->randomElement([
                'shopping',
                'food',
                'medicines',
                'sports_and_recreation',
                'entertainment',
                'bills',
            ]),
            'payment_method'    => $this->faker->randomElement(['cash', 'card']),
            'receipt_image'     => $this->faker->optional()->imageUrl(400, 300, 'business'),
            'is_recurring'      => $recurring,
            'recurring_interval'=> $recurring
                                    ? $this->faker->randomElement(['weekly', 'monthly', 'yearly'])
                                    : null,
            'tags'              => $this->faker->optional()->words($this->faker->numberBetween(1, 5)),
        ];
    }
}
