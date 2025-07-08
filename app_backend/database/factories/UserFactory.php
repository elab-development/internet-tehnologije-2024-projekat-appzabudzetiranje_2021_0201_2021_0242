<?php
// database/factories/UserFactory.php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'name'              => $this->faker->firstName,
            'surname'           => $this->faker->lastName,
            'email'             => $this->faker->unique()->safeEmail,
            'email_verified_at' => now(),
            'password'          => Hash::make('password'), // always “password”
            'image'             => $this->faker->optional()->imageUrl(200, 200, 'people'),
            'role'              => $this->faker->randomElement(['regular']),
            'phone'             => $this->faker->optional()->phoneNumber,
            'bio'               => $this->faker->optional()->sentence,
            'status'            => $this->faker->randomElement(['active', 'inactive']),
            'remember_token'    => Str::random(10),
        ];
    }
}
