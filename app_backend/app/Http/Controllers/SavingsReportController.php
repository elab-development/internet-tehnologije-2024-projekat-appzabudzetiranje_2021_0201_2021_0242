<?php

namespace App\Http\Controllers;

use App\Models\SavingsReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Http\Resources\SavingsReportResource;
use App\Http\Resources\ExpenseResource;

class SavingsReportController extends Controller
{
    /**
     * List all monthly savings reports for the authenticated user.
     * Accessible only by regular users.
     */
    public function index()
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }
        if ($user->role !== 'regular') {
            return response()->json(['error' => 'You do not have permission.'], 403);
        }

        $reports = SavingsReport::where('user_id', $user->id)->get();
        return SavingsReportResource::collection($reports);
    }

    /**
     * Create a new monthly savings report.
     * Accessible only by regular users.
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }
        if ($user->role !== 'regular') {
            return response()->json(['error' => 'You do not have permission.'], 403);
        }

        $data = $request->validate([
            'year'  => 'required|integer|min:2000|max:2100',
            'month' => [
                'required',
                'integer',
                'between:1,12',
                Rule::unique('savings_reports')
                    ->where('user_id', $user->id)
            ],
            'notes' => 'nullable|string',
        ]);

        $report = SavingsReport::create([
            'user_id' => $user->id,
            'year'    => $data['year'],
            'month'   => $data['month'],
            'notes'   => $data['notes'] ?? null,
        ]);

        return new SavingsReportResource($report);
    }

    /**
     * Show a specific monthly savings report.
     * Accessible only by regular users.
     */
    public function show($id)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }
        if ($user->role !== 'regular') {
            return response()->json(['error' => 'You do not have permission.'], 403);
        }

        $report = SavingsReport::find($id);
        if (! $report || $report->user_id !== $user->id) {
            return response()->json(['error' => 'Report not found.'], 404);
        }

        return new SavingsReportResource($report);
    }

    /**
     * Update an existing monthly savings report.
     * Accessible only by regular users.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }
        if ($user->role !== 'regular') {
            return response()->json(['error' => 'You do not have permission.'], 403);
        }

        $report = SavingsReport::find($id);
        if (! $report || $report->user_id !== $user->id) {
            return response()->json(['error' => 'Report not found.'], 404);
        }

        $data = $request->validate([
            'notes' => 'nullable|string'
        ]);

        $report->update($data);
        return new SavingsReportResource($report);
    }

    /**
     * Delete a monthly savings report.
     * Accessible only by regular users.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }
        if ($user->role !== 'regular') {
            return response()->json(['error' => 'You do not have permission.'], 403);
        }

        $report = SavingsReport::find($id);
        if (! $report || $report->user_id !== $user->id) {
            return response()->json(['error' => 'Report not found.'], 404);
        }

        $report->delete();
        return response()->json(['message' => 'Report deleted successfully.'], 200);
    }

    /**
     * Global statistics over ALL savings reports (admin only).
     * Returns one row per report with: year, month, expenses_count, total_expenses, average_expense.
     */
    public function statistics()
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }
        if ($user->role !== 'administrator') {
            return response()->json(['error' => 'You do not have permission.'], 403);
        }

        // Load all reports, along with expense counts and total amounts
        $reports = SavingsReport::query()
            ->withCount('expenses')
            ->withSum('expenses', 'amount')
            ->get();

        $stats = $reports->map(function ($report) {
            $count = (int) $report->expenses_count;
            $sum   = (float) ($report->expenses_sum_amount ?? 0);
            $avg   = $count > 0 ? round($sum / $count, 2) : 0.0;

            return [
                'report_id'       => $report->id,
                'year'            => (int) $report->year,
                'month'           => (int) $report->month,
                'expenses_count'  => $count,
                'total_expenses'  => $sum,
                'average_expense' => $avg,
            ];
        })->values();

        return response()->json(['statistics' => $stats]);
    }

    /**
     * Analytics for a specific savings report.
     * Returns the list of connected expenses plus simple aggregates.
     * Accessible only by regular users and only for their own report.
     */
    public function analytics($id)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }
        if ($user->role !== 'regular') {
            return response()->json(['error' => 'You do not have permission.'], 403);
        }

        $report = SavingsReport::with('expenses')->find($id);
        if (! $report || $report->user_id !== $user->id) {
            return response()->json(['error' => 'Report not found.'], 404);
        }

        // Pull expenses (ordered newest first)
        $expenses = $report->expenses()->orderBy('date', 'desc')->get();

        // Simple aggregates for the pop-up
        $total = $expenses->sum('amount');
        $count = $expenses->count();
        $avg   = $count ? round($total / $count, 2) : 0;

        // Optional breakdowns useful for charts/tables in the modal
        $byCategory = $expenses->groupBy('category')->map(function ($g) {
            return [
                'count' => $g->count(),
                'total' => $g->sum('amount'),
            ];
        });

        return response()->json([
            'report' => [
                'id'    => $report->id,
                'year'  => $report->year,
                'month' => $report->month,
                'notes' => $report->notes,
            ],
            'summary' => [
                'expenses_count'  => $count,
                'total_expenses'  => $total,
                'average_expense' => $avg,
            ],
            'by_category' => $byCategory, // { "Food": {count, total}, ... }
            'expenses'    => ExpenseResource::collection($expenses),
        ]);
    }
}
