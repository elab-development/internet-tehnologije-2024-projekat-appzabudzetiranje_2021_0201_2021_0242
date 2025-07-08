<?php
// database/factories/GroupFactory.php

namespace Database\Factories;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class GroupFactory extends Factory
{
    protected $model = Group::class;

    public function definition()
    {
        $name = $this->faker->unique()->company;
        return [
            'name'        => $name,
            'owner_id'    => User::factory(),
            'description' => $this->faker->optional()->paragraph,
            'slug'        => Str::slug($name),
            'privacy'     => $this->faker->randomElement(['public', 'private']),
        ];
    }
}
