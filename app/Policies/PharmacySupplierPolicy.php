<?php

namespace App\Policies;

use App\Models\Pharmacy;
use App\Models\PharmacySupplier;
use App\Models\User;

class PharmacySupplierPolicy
{
    /**
     * Determine if the user can view any pharmacy suppliers.
     */
    public function viewAny(User $user): bool
    {
        return in_array($user->type, [User::TYPE_ADMIN, User::TYPE_PHARMACY]);
    }

    /**
     * Determine if the user can view the pharmacy supplier.
     */
    public function view(User $user, PharmacySupplier $pharmacySupplier): bool
    {
        if ($user->type === User::TYPE_ADMIN) {
            return true;
        }

        // Pharmacy users can only view their own suppliers
        $pharmacy = $user->pharmacy;
        if (! $pharmacy) {
            return false;
        }

        return $pharmacySupplier->pharmacy_id === $pharmacy->id;
    }

    /**
     * Determine if the user can create pharmacy suppliers.
     */
    public function create(User $user): bool
    {
        return in_array($user->type, [User::TYPE_ADMIN, User::TYPE_PHARMACY]);
    }

    /**
     * Determine if the user can update the pharmacy supplier.
     */
    public function update(User $user, PharmacySupplier $pharmacySupplier): bool
    {
        if ($user->type === User::TYPE_ADMIN) {
            return true;
        }

        // Pharmacy users can only update their own suppliers
        $pharmacy = $user->pharmacy;
        if (! $pharmacy) {
            return false;
        }

        return $pharmacySupplier->pharmacy_id === $pharmacy->id;
    }

    /**
     * Determine if the user can delete the pharmacy supplier.
     */
    public function delete(User $user, PharmacySupplier $pharmacySupplier): bool
    {
        if ($user->type === User::TYPE_ADMIN) {
            return true;
        }

        // Pharmacy users can only delete their own suppliers
        $pharmacy = $user->pharmacy;
        if (! $pharmacy) {
            return false;
        }

        return $pharmacySupplier->pharmacy_id === $pharmacy->id;
    }
}
