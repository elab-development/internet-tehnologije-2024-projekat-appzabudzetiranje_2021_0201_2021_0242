<?php
// app/Http/Resources/UserResource.php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'surname'    => $this->surname,
            'email'      => $this->email,
            'image'      => $this->image,
            'role'       => $this->role,
            'phone'      => $this->phone,
            'bio'        => $this->bio,
            'settings'   => $this->settings,
            'status'     => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
