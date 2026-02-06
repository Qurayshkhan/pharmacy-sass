<?php

namespace App\Repositories;

use App\Interface\PharmacyInterface;
use App\Models\Pharmacy;
use Illuminate\Pagination\LengthAwarePaginator;

class PharmacyRepository implements PharmacyInterface
{
    public function getPharmacies(): LengthAwarePaginator
    {
        return Pharmacy::select('uuid','id','license_number', 'contact', 'user_id')->with('user:id,name,email,status')->paginate(25);
    }

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
