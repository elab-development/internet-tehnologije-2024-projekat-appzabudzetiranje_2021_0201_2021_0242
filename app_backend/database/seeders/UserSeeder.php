<?php
// database/seeders/UserSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run()
    {
        // 1) Administrator without factory
        User::create([
            'name'              => 'Admin',
            'surname'           => 'User',
            'email'             => 'admin@example.com',
            'email_verified_at' => now(),
            'password'          => 'password123',
            'image'             => 'https://i.pinimg.com/736x/f3/78/4a/f3784adc704a1bc9bcb2e494cd39caee.jpg',
            'role'              => 'administrator',
            'phone'             => null,
            'bio'               => null,
            'status'            => 'active',
            'remember_token'    => Str::random(10),
        ]);

        // 2) Regular users via factory
        User::factory()
            ->count(10)
            ->create();
    }
}
