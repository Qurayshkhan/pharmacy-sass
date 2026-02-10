<?php

namespace App\Interfaces;

use App\Models\Supplier;
use Illuminate\Pagination\LengthAwarePaginator;

interface SupplierInterface
{
    public function getSuppliers(array $columns): LengthAwarePaginator;

    public function create(array $data): Supplier;

    public function getById(int $id, array $columns = ['*']): ?Supplier;

    public function update(Supplier $supplier, array $data): Supplier;

    public function delete(Supplier $supplier): bool;
}
