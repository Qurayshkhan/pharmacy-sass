<?php

namespace App\Interface;

use App\Models\Pharmacy;

interface PharmacyInterface
{
    public function create(array $data): Pharmacy;

    public function updatePharmacy(array $data): bool;
}
