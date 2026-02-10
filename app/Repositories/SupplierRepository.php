<?php

namespace App\Repositories;

use App\Interfaces\SupplierInterface;
use App\Models\Supplier;
use Illuminate\Pagination\LengthAwarePaginator;

class SupplierRepository implements SupplierInterface
{
    public function getSuppliers(array $columns): LengthAwarePaginator
    {
        return Supplier::select($columns)->orderByDesc('created_at')->paginate(25);
    }

    public function create(array $data): Supplier
    {
        return Supplier::create($data);
    }

    public function getById(int $id, array $columns = ['*']): ?Supplier
    {
        return Supplier::select($columns)->find($id);
    }

    public function update(Supplier $supplier, array $data): Supplier
    {
        $supplier->update($data);

        return $supplier->fresh();
    }

    public function delete(Supplier $supplier): bool
    {
        return $supplier->delete();
    }
}
