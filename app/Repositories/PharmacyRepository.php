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

    public function getPharmacyByUserId(int $userId): ?Pharmacy
    {
        return Pharmacy::where('user_id', $userId)->first();
    }

    public function getPharmacyByUuid(string $uuid): ?Pharmacy
    {
        return Pharmacy::where('uuid', $uuid)->first();
    }

    public function updatePharmacy(array $data): bool
    {
        return Pharmacy::where('uuid', $data['uuid'])->update($data);
    }
}
