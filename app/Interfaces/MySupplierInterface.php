<?php

namespace App\Interfaces;

use App\Models\MySupplier;
use Illuminate\Pagination\LengthAwarePaginator;

interface MySupplierInterface
{
    public function getMySuppliers(int $userId, array $columns): LengthAwarePaginator;

    public function create(array $data): MySupplier;

    public function getById(int $id, array $columns = ['*']): ?MySupplier;

    public function update(MySupplier $mySupplier, array $data): MySupplier;

    public function delete(MySupplier $mySupplier): bool;
}
