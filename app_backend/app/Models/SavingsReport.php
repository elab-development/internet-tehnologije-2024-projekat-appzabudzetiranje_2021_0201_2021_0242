<?php
// app/Models/SavingsReport.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class SavingsReport extends Model
{
    protected $fillable = [
        'user_id',
        'year',       // npr. 2025
        'month',      // integer 1–12
        'notes',
    ];

    protected $casts = [
        'year'  => 'integer',
        'month' => 'integer',
    ];

    // opcioni aksesor za prvi i poslednji dan meseca
    public function getPeriodStartAttribute()
    {
        return Carbon::create($this->year, $this->month, 1)->toDateString();
    }

    public function getPeriodEndAttribute()
    {
        return Carbon::create($this->year, $this->month, 1)
                     ->endOfMonth()
                     ->toDateString();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}
