<?php

namespace App\Repositories;

use App\Interfaces\PharmacySupplierInterface;
use App\Models\PharmacySupplier;
use Illuminate\Pagination\LengthAwarePaginator;

class PharmacySupplierRepository implements PharmacySupplierInterface
{
    public function getPharmacySuppliers(int $pharmacyId, array $columns): LengthAwarePaginator
    {
        return PharmacySupplier::select($columns)
            ->where('pharmacy_id', $pharmacyId)
            ->orderByDesc('created_at')
            ->paginate(25);
    }

    public function create(array $data): PharmacySupplier
    {
        return PharmacySupplier::create($data);
    }

    public function getById(int $id, array $columns = ['*']): ?PharmacySupplier
    {
        return PharmacySupplier::select($columns)->find($id);
    }

    public function update(PharmacySupplier $pharmacySupplier, array $data): PharmacySupplier
    {
        $pharmacySupplier->update($data);

        return $pharmacySupplier->fresh();
    }

    public function delete(PharmacySupplier $pharmacySupplier): bool
    {
        return $pharmacySupplier->delete();
    }
}
