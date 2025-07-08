<?php
// app/Models/Expense.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'savings_report_id',
        'amount',
        'currency',
        'description',
        'date',
        'category',
        'payment_method',
        'receipt_image',
        'is_recurring',
        'recurring_interval',
        'tags',
    ];

    protected $casts = [
        'date'             => 'date',
        'is_recurring'     => 'boolean',
        'tags'             => 'array',
    ];

    public function savingsReport()
    {
        return $this->belongsTo(SavingsReport::class);
    }
}
