<?php
// app/Models/Group.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Group extends Model
{
    protected $fillable = [
        'name',
        'owner_id',
        'description',
        'slug',
        'privacy',
    ];

    protected static function booted()
    {
        static::creating(function ($group) {
            $group->slug = Str::slug($group->name);
        });
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class)
                    ->withTimestamps();
    }
}
