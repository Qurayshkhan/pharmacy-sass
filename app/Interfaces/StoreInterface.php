<?php

namespace App\Interfaces;

use Illuminate\Pagination\LengthAwarePaginator;

interface StoreInterface
{
    public function getStores(): LengthAwarePaginator;

    public function updateStore($storeId, array $data): bool|int;
}
