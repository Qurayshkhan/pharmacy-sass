<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Str;

class UserObserver
{
    public function creating(User $user): void
    {
        $user->uuid = Str::uuid();
    }

    public function created(User $user): void
    {
        if ($user->type === User::TYPE_STORE) {
            $user->store()->updateOrCreate(['user_id' => $user->id], ['user_id' => $user->id]);
        }
    }
}
