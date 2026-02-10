<?php

namespace App\Interfaces;

use App\Models\PharmacySupplier;
use Illuminate\Pagination\LengthAwarePaginator;

interface PharmacySupplierInterface
{
    public function getPharmacySuppliers(int $pharmacyId, array $columns): LengthAwarePaginator;

    public function create(array $data): PharmacySupplier;

    public function getById(int $id, array $columns = ['*']): ?PharmacySupplier;

    public function update(PharmacySupplier $pharmacySupplier, array $data): PharmacySupplier;

    public function delete(PharmacySupplier $pharmacySupplier): bool;
}
