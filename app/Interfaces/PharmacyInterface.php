<?php

namespace App\Interfaces;

use App\Models\Pharmacy;
use Illuminate\Pagination\LengthAwarePaginator;

interface PharmacyInterface
{
    public function create(array $data): Pharmacy;

    public function getPharmacies(array $columns): LengthAwarePaginator;

    public function updatePharmacy(array $data): bool;

    public function getPharmacyByUuid(string $uuid): ?Pharmacy;

    public function getPharmacyByUserId(int $userId): ?Pharmacy;
}
