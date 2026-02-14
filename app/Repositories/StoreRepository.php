<?php

namespace App\Repositories;

use App\Interfaces\StoreInterface;
use App\Models\Store;
use Illuminate\Pagination\LengthAwarePaginator;

class StoreRepository implements StoreInterface
{
    public function getStores(): LengthAwarePaginator
    {
        return Store::select('id', 'user_id', 'contact', 'is_active', 'branch', 'address')->with('user:id,name,email,uuid')->paginate(25);
    }

    public function updateStore($storeId, array $data): bool|int
    {
        return Store::where('id', $storeId)->update($data);
    }
}
