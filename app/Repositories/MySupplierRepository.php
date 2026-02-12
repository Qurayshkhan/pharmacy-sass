<?php

namespace App\Repositories;

use App\Interfaces\MySupplierInterface;
use App\Models\MySupplier;
use Illuminate\Pagination\LengthAwarePaginator;

class MySupplierRepository implements MySupplierInterface
{
    public function getMySuppliers(int $userId, array $columns): LengthAwarePaginator
    {
        return MySupplier::select($columns)
            ->where('user_id', $userId)
            ->orderByDesc('created_at')
            ->paginate(25);
    }

    public function create(array $data): MySupplier
    {
        return MySupplier::create($data);
    }

    public function getById(int $id, array $columns = ['*']): ?MySupplier
    {
        return MySupplier::select($columns)->find($id);
    }

    public function update(MySupplier $mySupplier, array $data): MySupplier
    {
        $mySupplier->update($data);

        return $mySupplier->fresh();
    }

    public function delete(MySupplier $mySupplier): bool
    {
        return $mySupplier->delete();
    }
}
