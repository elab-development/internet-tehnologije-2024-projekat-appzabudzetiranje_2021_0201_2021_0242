<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Http\Resources\UserResource;

class UserController extends Controller
{
    /**
     * List all users.
     * Accessible by regular or administrator.
     */
    public function index()
    {
        $me   = Auth::user();
        if (! $me) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $role = $me->role;
        if (in_array($role, ['regular', 'administrator'])) {
            $users = User::all();
            return UserResource::collection($users);
        }

        return response()->json(['error' => 'You do not have permission.'], 403);
    }

    /**
     * Create a new user.
     * Accessible only by regular users.
     */
    public function store(Request $request)
    {
        $me   = Auth::user();
        if (! $me) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $role = $me->role;
        if ($role !== 'regular') {
            return response()->json(['error' => 'You do not have permission.'], 403);
        }

        $data = $request->validate([
            'name'     => 'required|string|max:150',
            'surname'  => 'required|string|max:150',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:regular,administrator',
            'status'   => 'required|in:active,inactive',
            'image'    => 'nullable|url',
            'phone'    => 'nullable|string|max:50',
            'bio'      => 'nullable|string',
        ]);

        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);

        return new UserResource($user);
    }

    /**
     * Show one user by ID.
     * Accessible only by regular users.
     */
    public function show($id)
    {
        $me   = Auth::user();
        if (! $me) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $role = $me->role;
        if ($role !== 'regular') {
            return response()->json(['error' => 'You do not have permission.'], 403);
        }

        $user = User::find($id);
        if (! $user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        return new UserResource($user);
    }

    /**
     * Update a user by ID.
     * Accessible only by regular users.
     */
    public function update(Request $request, $id)
    {
        $me   = Auth::user();
        if (! $me) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $role = $me->role;
        if ($role !== 'regular') {
            return response()->json(['error' => 'You do not have permission.'], 403);
        }

        $user = User::find($id);
        if (! $user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        $data = $request->validate([
            'name'     => 'sometimes|required|string|max:150',
            'surname'  => 'sometimes|required|string|max:150',
            'email'    => [
                'sometimes',
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => 'sometimes|required|string|min:6',
            'role'     => 'sometimes|required|in:regular,administrator',
            'status'   => 'sometimes|required|in:active,inactive',
            'image'    => 'nullable|url',
            'phone'    => 'nullable|string|max:50',
            'bio'      => 'nullable|string',
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);
        return new UserResource($user);
    }

    /**
     * Delete a user by ID.
     * Accessible only by regular users.
     */
    public function destroy($id)
    {
        $me   = Auth::user();
        if (! $me) {
            return response()->json(['error' => 'Unauthenticated.'], 401);
        }

        $role = $me->role;
        if ($role !== 'regular') {
            return response()->json(['error' => 'You do not have permission.'], 403);
        }

        $user = User::find($id);
        if (! $user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully.'], 200);
    }
}
