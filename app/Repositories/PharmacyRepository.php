<?php

namespace App\Repositories;

use App\Interface\PharmacyInterface;
use App\Models\Pharmacy;

class PharmacyRepository implements PharmacyInterface
{
    public function create(array $data): Pharmacy
    {
        return Pharmacy::create($data);
    }
}
