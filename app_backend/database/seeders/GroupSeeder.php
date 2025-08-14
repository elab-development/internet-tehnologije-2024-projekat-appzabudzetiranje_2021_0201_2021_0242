<?php
// database/seeders/GroupSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Group;
use App\Models\User;
use Illuminate\Support\Str;

class GroupSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        // Create 5 groups, each with a random existing owner and random members
        Group::factory()
            ->count(5)
            ->make()
            ->each(function (Group $group) use ($users) {
                // assign an existing user as owner
                $owner = $users->random();
                $group->owner_id = $owner->id;
                $group->slug     = Str::slug($group->name);
                $group->save();

                // attach a random subset of users as members (including the owner)
                $memberIds = $users
                    ->shuffle()
                    ->take(rand(2, 5))
                    ->pluck('id')
                    ->all();

                $group->users()->attach($memberIds);
            });
    }
}
