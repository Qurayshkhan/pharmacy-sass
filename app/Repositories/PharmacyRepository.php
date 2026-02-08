<?php

namespace App\Repositories;

use App\Interfaces\PharmacyInterface;
use App\Models\Pharmacy;
use Illuminate\Pagination\LengthAwarePaginator;

class PharmacyRepository implements PharmacyInterface
{
    public function getPharmacies(array $columns): LengthAwarePaginator
    {
        return Pharmacy::select($columns)->with('user:uuid,id,name,email,status')->orderByDesc('created_at')->paginate(25);
    }

    public function create(array $data): Pharmacy
    {
        return Pharmacy::create($data);
    }

    public function getPharmacyByUserId(int $userId): ?Pharmacy
    {
        return Pharmacy::select('uuid', 'id', 'license_number', 'contact', 'user_id', 'branch', 'address')
            ->with('user:uuid,id,name,email,status')
            ->where('user_id', $userId)
            ->first();
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
