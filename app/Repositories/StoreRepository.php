<?php

namespace App\Repositories;

use App\Interfaces\StoreInterface;
use App\Models\Store;

class StoreRepository implements StoreInterface
{
    public function getStores()
    {
        return Store::select('id', 'user_id', 'contact', 'is_active')->with('user:id,name,email')->paginate(25);
    }
}
