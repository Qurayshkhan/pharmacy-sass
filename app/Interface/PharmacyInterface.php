<?php

namespace App\Interface;

use App\Models\Pharmacy;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface PharmacyInterface
{
    public function create(array $data): Pharmacy;

    public function getPharmacies(): LengthAwarePaginator;

    public function updatePharmacy(array $data): bool;

     public function getPharmacyByUuid(string $uuid): ?Pharmacy;

    public function getPharmacyByUserId(int $userId): ?Pharmacy;
}
