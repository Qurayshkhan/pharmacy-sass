<?php

namespace App\Policies;

use App\Models\MySupplier;
use App\Models\User;

class MySupplierPolicy
{
    /**
     * Determine if the user can view any my suppliers.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->type, [User::TYPE_ADMIN, User::TYPE_PHARMACY]);
    }

    /**
     * Determine if the user can view the my supplier.
     */
    public function view(User $user, MySupplier $mySupplier): bool
    {
        if ($user->type === User::TYPE_ADMIN) {
            return true;
        }

        // Users can only view their own suppliers
        return $mySupplier->user_id === $user->id;
    }

    /**
     * Determine if the user can create my suppliers.
     */
    public function create(User $user): bool
    {
        return in_array($user->type, [User::TYPE_ADMIN, User::TYPE_PHARMACY]);
    }

    /**
     * Determine if the user can update the my supplier.
     */
    public function update(User $user, MySupplier $mySupplier): bool
    {
        if ($user->type === User::TYPE_ADMIN) {
            return true;
        }

        // Users can only update their own suppliers
        return $mySupplier->user_id === $user->id;
    }

    /**
     * Determine if the user can delete the my supplier.
     */
    public function delete(User $user, MySupplier $mySupplier): bool
    {
        if ($user->type === User::TYPE_ADMIN) {
            return true;
        }

        // Users can only delete their own suppliers
        return $mySupplier->user_id === $user->id;
    }
}
